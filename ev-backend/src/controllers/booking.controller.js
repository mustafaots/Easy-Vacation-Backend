import bookingModel from '../models/booking.model.js';

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.findAll();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const booking = await bookingModel.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await bookingModel.update(req.params.id, req.body);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await bookingModel.deleteByBookingId(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingsByClient = async (req, res) => {
  try {
    const bookings = await bookingModel.findByClient(req.params.clientId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingsByPost = async (req, res) => {
  try {
    const bookings = await bookingModel.findByPost(req.params.postId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};