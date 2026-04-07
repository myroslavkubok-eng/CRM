// supabase/functions/register-owner/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegisterOwnerRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  company_name?: string;
  salon_name?: string; // Опционально: создать первый салон сразу
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: RegisterOwnerRequest = await req.json();
    const { email, password, full_name, phone, company_name, salon_name } = body;

    // Валидация
    if (!email || !password || !full_name) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: email, password, full_name' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Password strength check
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Password must be at least 8 characters long' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Проверяем существование email в owners
    const { data: existingOwner } = await supabaseAdmin
      .from('owners')
      .select('id')
      .eq('email', email)
      .single();

    if (existingOwner) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email already registered as owner' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // STEP 1: Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for now
      user_metadata: {
        full_name,
        phone: phone || null,
        role: 'owner'
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to create user: ${authError.message}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const userId = authData.user.id;

    try {
      // STEP 2: Create owner record
      const { data: ownerData, error: ownerError } = await supabaseAdmin
        .from('owners')
        .insert({
          user_id: userId,
          full_name,
          email,
          phone: phone || null,
          company_name: company_name || null,
          subscription_plan: 'trial',
          subscription_status: 'trialing',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days trial
          max_salons: 1,
          max_masters_per_salon: 5,
          max_admins_per_salon: 2,
          is_active: true
        })
        .select()
        .single();

      if (ownerError) {
        throw new Error(`Failed to create owner record: ${ownerError.message}`);
      }

      // STEP 3: Опционально создать первый салон
      let salonData = null;
      if (salon_name) {
        const { data: newSalon, error: salonError } = await supabaseAdmin
          .from('salons')
          .insert({
            owner_id: ownerData.id,
            name: salon_name,
            is_published: false,
            subscription_plan: 'basic',
            subscription_status: 'active'
          })
          .select()
          .single();

        if (salonError) {
          console.error('Salon creation error:', salonError);
          // Не прерываем процесс, салон можно создать позже
        } else {
          salonData = newSalon;

          // Добавляем owner в salon_staff
          await supabaseAdmin
            .from('salon_staff')
            .insert({
              user_id: userId,
              salon_id: newSalon.id,
              role: 'owner',
              is_active: true,
              accepted_at: new Date().toISOString()
            });
        }
      }

      // Success response
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            user_id: userId,
            owner_id: ownerData.id,
            email: ownerData.email,
            full_name: ownerData.full_name,
            subscription_plan: ownerData.subscription_plan,
            trial_ends_at: ownerData.trial_ends_at,
            salon: salonData ? {
              id: salonData.id,
              name: salonData.name
            } : null
          },
          message: 'Owner registered successfully. Please check your email to verify your account.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (error) {
      // Rollback: delete auth user
      console.error('Error during owner creation:', error);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      
      throw error;
    }

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
