import { Router } from 'express';
import { getAllBookings, getBookingById, createBooking, updateBooking, deleteBooking, getBookingsByClient, getBookingsByPost } from '../controllers/booking.controller.js';

const router = Router();

router.get('/', getAllBookings);
router.get('/client/:clientId', getBookingsByClient);
router.get('/post/:postId', getBookingsByPost);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;