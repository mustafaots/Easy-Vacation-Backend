import supabase from '../config/supabaseClient.js';

class PostModel {
  constructor() {
    this.table = 'posts';
  }

  async findAll() {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        owner:users(*),
        location:locations(*),
        stay:stays(*),
        activity:activities(*),
        vehicle:vehicles(*),
        images:post_images(*)
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
        owner:users(*),
        location:locations(*),
        stay:stays(*),
        activity:activities(*),
        vehicle:vehicles(*),
        images:post_images(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async findByOwner(ownerId) {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        location:locations(*),
        stay:stays(*),
        activity:activities(*),
        vehicle:vehicles(*),
        images:post_images(*)
      `)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async create(postData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([postData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await supabase
      .from(this.table)
      .update({ ...updates, updated_at: new Date().toISOString() })
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

  async findByCategory(category) {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        owner:users(*),
        location:locations(*),
        stay:stays(*),
        activity:activities(*),
        vehicle:vehicles(*),
        images:post_images(*)
      `)
      .eq('category', category)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

export default new PostModel();