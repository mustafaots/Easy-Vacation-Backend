import supabase from '../config/supabaseClient.js';

class LocationModel {
  constructor() {
    this.table = 'locations';
  }

  async create(locationData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([locationData])
      .select()
      .single();
    
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

  // Optional: For cleaning up orphaned records or edge cases
  async deleteById(id) {  // Changed from deleteByPostId
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

export default new LocationModel();