import { Router } from 'express';
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview, getReviewsByPost, getReviewsByReviewer } from '../controllers/review.controller.js';

const router = Router();

router.get('/', getAllReviews);
router.get('/post/:postId', getReviewsByPost);
router.get('/reviewer/:reviewerId', getReviewsByReviewer);
router.get('/:id', getReviewById);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;