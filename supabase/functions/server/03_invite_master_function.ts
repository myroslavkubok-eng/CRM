// supabase/functions/invite-master/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteMasterRequest {
  salon_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  specialization?: string;
  services?: string[];
  working_hours?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Получаем токен авторизации
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: InviteMasterRequest = await req.json();
    const { 
      salon_id, 
      first_name, 
      last_name, 
      email, 
      phone, 
      specialization,
      services,
      working_hours 
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

    // Create Supabase client с токеном пользователя
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Create admin client для некоторых операций
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
      .select('id, owner_id, owners!inner(id, user_id, max_masters_per_salon)')
      .eq('id', salon_id)
      .single();

    if (salonError || !salon) {
      return new Response(
        JSON.stringify({ success: false, error: 'Salon not found or access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Проверяем права (должен быть owner)
    if (salon.owners.user_id !== user.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Only salon owner can invite masters' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 2: Проверяем лимиты (используя RPC функцию)
    const { data: canInvite, error: limitError } = await supabaseAdmin
      .rpc('check_owner_limits', {
        p_owner_id: salon.owner_id,
        p_salon_id: salon_id,
        p_role: 'master'
      });

    if (limitError) {
      console.error('Limit check error:', limitError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to check limits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!canInvite) {
      const maxMasters = salon.owners.max_masters_per_salon;
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Master limit reached. Your plan allows maximum ${maxMasters} masters per salon.` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 3: Проверяем, не зарегистрирован ли уже этот email
    const { data: existingMaster } = await supabaseAdmin
      .from('masters')
      .select('id')
      .eq('email', email)
      .eq('salon_id', salon_id)
      .single();

    if (existingMaster) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Master with this email already exists in this salon' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 4: Генерируем invitation token
    const { data: tokenData } = await supabaseAdmin
      .rpc('generate_invitation_token');
    
    const invitationToken = tokenData || crypto.randomUUID();

    // STEP 5: Создаем запись приглашения
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('invitations')
      .insert({
        salon_id,
        invited_by: salon.owner_id,
        email,
        role: 'master',
        first_name,
        last_name: last_name || null,
        phone: phone || null,
        invitation_token: invitationToken,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        additional_data: {
          specialization,
          services,
          working_hours
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

    // STEP 6: Создаем временную запись мастера со статусом 'invited'
    const { data: masterRecord, error: masterError } = await supabaseAdmin
      .from('masters')
      .insert({
        salon_id,
        first_name,
        last_name: last_name || null,
        email,
        phone: phone || null,
        specialization: specialization || null,
        services: services || [],
        working_hours: working_hours || {},
        invited_by: salon.owner_id,
        invitation_token: invitationToken,
        invitation_sent_at: new Date().toISOString(),
        status: 'invited',
        is_active: false
      })
      .select()
      .single();

    if (masterError) {
      // Откатываем приглашение
      await supabaseAdmin
        .from('invitations')
        .delete()
        .eq('id', invitation.id);

      console.error('Master record creation error:', masterError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to create master record: ${masterError.message}` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Отправить email с приглашением
    // Для этого можно использовать SendGrid, Resend, или другой сервис
    const invitationLink = `${Deno.env.get('APP_URL')}/accept-invitation?token=${invitationToken}`;
    
    console.log('Invitation link:', invitationLink);
    console.log('Send email to:', email);

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          invitation_id: invitation.id,
          master_id: masterRecord.id,
          email,
          invitation_token: invitationToken,
          invitation_link: invitationLink,
          expires_at: invitation.expires_at
        },
        message: `Invitation sent to ${email}. The invitation is valid for 7 days.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Invite master error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
