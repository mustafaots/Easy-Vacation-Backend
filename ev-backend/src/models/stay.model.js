import supabase from '../config/supabaseClient.js';

class StayModel {
  constructor() {
    this.table = 'stays';
  }

  async create(stayData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([stayData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async findByPostId(postId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('post_id', postId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(postId, updates) {
    const { data, error } = await supabase
      .from(this.table)
      .update(updates)
      .eq('post_id', postId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Optional: For cleaning up orphaned records or edge cases
  async deleteByPostId(postId) {
    const { error } = await supabase
      .from('stays')
      .delete()
      .eq('post_id', postId);
    
    if (error) throw error;
    return true;
  }
}

export default new StayModel();