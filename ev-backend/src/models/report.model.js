import supabase from '../config/supabaseClient.js';

class ReportModel {
  constructor() {
    this.table = 'reports';
  }

  async findAll() {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        reporter:users(*),
        reported_post:posts(*),
        reported_user:users!reports_reported_user_id_fkey(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        reporter:users(*),
        reported_post:posts(*),
        reported_user:users!reports_reported_user_id_fkey(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(reportData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([reportData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteById(id) {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

export default new ReportModel();