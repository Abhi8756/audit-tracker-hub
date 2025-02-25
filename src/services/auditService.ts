
import { supabase } from '@/lib/supabase';
import type { Audit } from '@/types/audit';

export const auditService = {
  async getAudits() {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Audit[];
  },

  async createAudit(audit: Omit<Audit, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('audits')
      .insert([audit])
      .select()
      .single();

    if (error) throw error;
    return data as Audit;
  },

  async updateAudit(id: number, updates: Partial<Audit>) {
    const { data, error } = await supabase
      .from('audits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Audit;
  },

  async uploadReport(file: File) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('audit-reports')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('audit-reports')
      .getPublicUrl(fileName);

    return publicUrl;
  }
};
