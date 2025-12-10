import { Router } from 'express';
import { getAllPosts, getPostById, createPost, updatePost, deletePost, getPostsByOwner, getPostsByCategory } from '../controllers/post.controller.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/owner/:ownerId', getPostsByOwner);
router.get('/category/:category', getPostsByCategory);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;