import supabase from '../config/supabaseClient.js';

class PostImageModel {
  constructor() {
    this.table = 'post_images';
  }

  async create(imageData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([imageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async findByPostId(postId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('post_id', postId);
    
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
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

export default new PostImageModel();