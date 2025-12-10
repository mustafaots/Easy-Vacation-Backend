import supabase from '../config/supabaseClient.js';

class SubscriptionModel {
  constructor() {
    this.table = 'subscriptions';
  }

  async findAll() {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        subscriber:users(*)
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
        subscriber:users(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async findBySubscriber(subscriberId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('subscriber_id', subscriberId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async create(subscriptionData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([subscriptionData])
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

export default new SubscriptionModel();