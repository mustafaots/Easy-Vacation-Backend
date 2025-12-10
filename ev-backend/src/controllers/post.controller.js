import postModel from '../models/post.model.js';
import locationModel from '../models/location.model.js';
import stayModel from '../models/stay.model.js';
import activityModel from '../models/activity.model.js';
import vehicleModel from '../models/vehicle.model.js';
import postImageModel from '../models/postimage.model.js';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { location, stay, activity, vehicle, images, ...postData } = req.body;

    let locationId;
    if (location) {
      const locationRecord = await locationModel.create(location);
      locationId = locationRecord.id;
    }

    const post = await postModel.create({
      ...postData,
      location_id: locationId,
    });

    if (post.category === 'stay' && stay) {
      await stayModel.create({ ...stay, post_id: post.id });
    } else if (post.category === 'activity' && activity) {
      await activityModel.create({ ...activity, post_id: post.id });
    } else if (post.category === 'vehicle' && vehicle) {
      await vehicleModel.create({ ...vehicle, post_id: post.id });
    }

    if (images && images.length > 0) {
      for (const image of images) {
        await postImageModel.create({ ...image, post_id: post.id });
      }
    }

    const completePost = await postModel.findById(post.id);
    res.status(201).json(completePost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { location, stay, activity, vehicle, ...postData } = req.body;

    const post = await postModel.update(req.params.id, postData);

    if (location && post.location_id) {
      await locationModel.update(post.location_id, location);
    }

    if (post.category === 'stay' && stay) {
      await stayModel.update(post.id, stay);
    } else if (post.category === 'activity' && activity) {
      await activityModel.update(post.id, activity);
    } else if (post.category === 'vehicle' && vehicle) {
      await vehicleModel.update(post.id, vehicle);
    }

    const updatedPost = await postModel.findById(post.id);
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    await postModel.deleteById(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostsByOwner = async (req, res) => {
  try {
    const posts = await postModel.findByOwner(req.params.ownerId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostsByCategory = async (req, res) => {
  try {
    const posts = await postModel.findByCategory(req.params.category);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};