// src/hooks/useOwnerInvitations.ts
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface InviteMasterData {
  salon_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  specialization?: string;
  services?: string[];
  working_hours?: any;
}

interface InviteAdminData {
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

export const useOwnerInvitations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Пригласить мастера
  const inviteMaster = async (data: InviteMasterData) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: invokeError } = await supabase.functions.invoke(
        'invite-master',
        {
          body: data
        }
      );

      if (invokeError) throw invokeError;

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to invite master';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Пригласить админа
  const inviteAdmin = async (data: InviteAdminData) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: invokeError } = await supabase.functions.invoke(
        'invite-admin',
        {
          body: data
        }
      );

      if (invokeError) throw invokeError;

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to invite admin';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Получить список приглашений салона
  const getSalonInvitations = async (salonId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('invitations')
        .select('*')
        .eq('salon_id', salonId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch invitations';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Отозвать приглашение
  const revokeInvitation = async (invitationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('invitations')
        .update({ status: 'revoked' })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to revoke invitation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Переслать приглашение (обновить expires_at)
  const resendInvitation = async (invitationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const { error: updateError } = await supabase
        .from('invitations')
        .update({ 
          expires_at: newExpiresAt,
          status: 'pending'
        })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      // TODO: Отправить email снова

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to resend invitation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    inviteMaster,
    inviteAdmin,
    getSalonInvitations,
    revokeInvitation,
    resendInvitation
  };
};
