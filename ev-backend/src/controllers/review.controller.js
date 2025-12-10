import reviewModel from '../models/review.model.js';

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await reviewModel.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await reviewModel.update(req.params.id, req.body);
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await reviewModel.deleteById(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewsByPost = async (req, res) => {
  try {
    const reviews = await reviewModel.findByPost(req.params.postId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewsByReviewer = async (req, res) => {
  try {
    const reviews = await reviewModel.findByReviewer(req.params.reviewerId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};