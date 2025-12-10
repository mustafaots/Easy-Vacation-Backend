import { Router } from 'express';
import { getAllSubscriptions, getSubscriptionById, createSubscription, updateSubscription, deleteSubscription, getSubscriptionsByUser } from '../controllers/subscription.controller.js';

const router = Router();

router.get('/', getAllSubscriptions);
router.get('/user/:userId', getSubscriptionsByUser);
router.get('/:id', getSubscriptionById);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

export default router;