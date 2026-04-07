// supabase/functions/accept-invitation/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AcceptInvitationRequest {
  invitation_token: string;
  password: string;
  confirm_password: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: AcceptInvitationRequest = await req.json();
    const { invitation_token, password, confirm_password } = body;

    // Валидация
    if (!invitation_token || !password || !confirm_password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (password !== confirm_password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Passwords do not match' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Password must be at least 8 characters long' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // STEP 1: Получаем приглашение
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .eq('invitation_token', invitation_token)
      .single();

    if (invitationError || !invitation) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid invitation token' 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 2: Проверяем статус и срок действия
    if (invitation.status !== 'pending') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invitation is ${invitation.status}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (new Date(invitation.expires_at) < new Date()) {
      // Обновляем статус на expired
      await supabaseAdmin
        .from('invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invitation has expired' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 3: Создаем auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: invitation.email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        phone: invitation.phone,
        role: invitation.role,
        salon_id: invitation.salon_id
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to create account: ${authError.message}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = authData.user.id;

    try {
      // STEP 4: Обновляем запись мастера или админа
      if (invitation.role === 'master') {
        const { error: updateError } = await supabaseAdmin
          .from('masters')
          .update({
            user_id: userId,
            invitation_accepted_at: new Date().toISOString(),
            status: 'active',
            is_active: true
          })
          .eq('invitation_token', invitation_token);

        if (updateError) {
          throw new Error(`Failed to update master: ${updateError.message}`);
        }

        // Получаем обновленную запись мастера
        const { data: master } = await supabaseAdmin
          .from('masters')
          .select('id, salon_id')
          .eq('invitation_token', invitation_token)
          .single();

        if (master) {
          // Добавляем в salon_staff
          await supabaseAdmin
            .from('salon_staff')
            .insert({
              user_id: userId,
              salon_id: master.salon_id,
              role: 'master',
              master_id: master.id,
              is_active: true,
              accepted_at: new Date().toISOString()
            });
        }

      } else if (invitation.role === 'admin') {
        const { error: updateError } = await supabaseAdmin
          .from('admins')
          .update({
            user_id: userId,
            invitation_accepted_at: new Date().toISOString(),
            status: 'active',
            is_active: true
          })
          .eq('invitation_token', invitation_token);

        if (updateError) {
          throw new Error(`Failed to update admin: ${updateError.message}`);
        }

        // Получаем обновленную запись админа
        const { data: admin } = await supabaseAdmin
          .from('admins')
          .select('id, salon_id')
          .eq('invitation_token', invitation_token)
          .single();

        if (admin) {
          // Добавляем в salon_staff
          await supabaseAdmin
            .from('salon_staff')
            .insert({
              user_id: userId,
              salon_id: admin.salon_id,
              role: 'admin',
              admin_id: admin.id,
              is_active: true,
              accepted_at: new Date().toISOString()
            });
        }
      }

      // STEP 5: Обновляем статус приглашения
      await supabaseAdmin
        .from('invitations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      // STEP 6: Создаем сессию для автоматического входа
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createSession({
        userId: userId
      });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
      }

      // Success response
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            user_id: userId,
            email: authData.user.email,
            role: invitation.role,
            salon_id: invitation.salon_id,
            session: sessionData?.session || null
          },
          message: 'Invitation accepted successfully. You can now login.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      // Rollback: delete auth user
      console.error('Error during invitation acceptance:', error);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      
      throw error;
    }

  } catch (error) {
    console.error('Accept invitation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
