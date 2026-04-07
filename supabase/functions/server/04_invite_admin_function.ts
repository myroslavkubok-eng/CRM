// supabase/functions/invite-admin/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteAdminRequest {
  salon_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  permissions?: {
    can_manage_bookings?: boolean;
    can_manage_customers?: boolean;
    can_view_analytics?: boolean;
    can_manage_services?: boolean;
    can_manage_schedule?: boolean;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: InviteAdminRequest = await req.json();
    const { 
      salon_id, 
      first_name, 
      last_name, 
      email, 
      phone,
      permissions 
    } = body;

    // Валидация
    if (!salon_id || !first_name || !email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: salon_id, first_name, email' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Получаем текущего пользователя
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 1: Проверяем, что пользователь - владелец этого салона
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id, owner_id, owners!inner(id, user_id, max_admins_per_salon)')
      .eq('id', salon_id)
      .single();

    if (salonError || !salon) {
      return new Response(
        JSON.stringify({ success: false, error: 'Salon not found or access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (salon.owners.user_id !== user.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Only salon owner can invite admins' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 2: Проверяем лимиты
    const { data: canInvite, error: limitError } = await supabaseAdmin
      .rpc('check_owner_limits', {
        p_owner_id: salon.owner_id,
        p_salon_id: salon_id,
        p_role: 'admin'
      });

    if (limitError) {
      console.error('Limit check error:', limitError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to check limits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!canInvite) {
      const maxAdmins = salon.owners.max_admins_per_salon;
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Admin limit reached. Your plan allows maximum ${maxAdmins} admins per salon.` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 3: Проверяем существование админа
    const { data: existingAdmin } = await supabaseAdmin
      .from('admins')
      .select('id')
      .eq('email', email)
      .eq('salon_id', salon_id)
      .single();

    if (existingAdmin) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Admin with this email already exists in this salon' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 4: Генерируем invitation token
    const { data: tokenData } = await supabaseAdmin
      .rpc('generate_invitation_token');
    
    const invitationToken = tokenData || crypto.randomUUID();

    // Права по умолчанию
    const defaultPermissions = {
      can_manage_bookings: true,
      can_manage_customers: true,
      can_view_analytics: false,
      can_manage_services: false,
      can_manage_schedule: false,
      ...permissions
    };

    // STEP 5: Создаем приглашение
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('invitations')
      .insert({
        salon_id,
        invited_by: salon.owner_id,
        email,
        role: 'admin',
        first_name,
        last_name: last_name || null,
        phone: phone || null,
        invitation_token: invitationToken,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        additional_data: {
          permissions: defaultPermissions
        }
      })
      .select()
      .single();

    if (invitationError) {
      console.error('Invitation creation error:', invitationError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to create invitation: ${invitationError.message}` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 6: Создаем запись админа со статусом 'invited'
    const { data: adminRecord, error: adminError } = await supabaseAdmin
      .from('admins')
      .insert({
        salon_id,
        first_name,
        last_name: last_name || null,
        email,
        phone: phone || null,
        permissions: defaultPermissions,
        invited_by: salon.owner_id,
        invitation_token: invitationToken,
        invitation_sent_at: new Date().toISOString(),
        status: 'invited',
        is_active: false
      })
      .select()
      .single();

    if (adminError) {
      // Откатываем приглашение
      await supabaseAdmin
        .from('invitations')
        .delete()
        .eq('id', invitation.id);

      console.error('Admin record creation error:', adminError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to create admin record: ${adminError.message}` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Invitation link
    const invitationLink = `${Deno.env.get('APP_URL')}/accept-invitation?token=${invitationToken}`;
    
    console.log('Admin invitation link:', invitationLink);
    console.log('Send email to:', email);

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          invitation_id: invitation.id,
          admin_id: adminRecord.id,
          email,
          invitation_token: invitationToken,
          invitation_link: invitationLink,
          expires_at: invitation.expires_at,
          permissions: defaultPermissions
        },
        message: `Invitation sent to ${email}. The invitation is valid for 7 days.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Invite admin error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
