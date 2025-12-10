import supabase from '../config/supabaseClient.js';

class BookingModel {
  constructor() {
    this.table = 'bookings';
  }

  async findAll() {
    const { data, error } = await supabase
      .from(this.table)
      .select(`d
        *,
        post:posts(*, location:locations(*)),
        client:users(*)
      `)
      .order('booked_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        post:posts(*, location:locations(*)),
        client:users(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async findByClient(clientId) {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        post:posts(*, location:locations(*))
      `)
      .eq('client_id', clientId)
      .order('booked_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async findByPost(postId) {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        client:users(*)
      `)
      .eq('post_id', postId)
      .order('booked_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async create(bookingData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([bookingData])
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

  async deleteByBookingId(id) {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

export default new BookingModel();