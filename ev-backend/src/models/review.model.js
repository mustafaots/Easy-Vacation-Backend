import supabase from '../config/supabaseClient.js';

class ReviewModel {
  constructor() {
    this.table = 'reviews';
  }

  async findAll() {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        post:posts(*),
        reviewer:users(*)
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
        post:posts(*),
        reviewer:users(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async findByPost(postId) {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        reviewer:users(*)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async findByReviewer(reviewerId) {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        post:posts(*)
      `)
      .eq('reviewer_id', reviewerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async create(reviewData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([reviewData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await supabase
      .from(this.table)
      .update(updates)
      .eq('id', id)
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

export default new ReviewModel();