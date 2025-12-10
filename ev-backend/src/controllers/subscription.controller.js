import subscriptionModel from '../models/subscription.model.js';

export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionModel.findAll();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await subscriptionModel.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionModel.create(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionModel.update(req.params.id, req.body);
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    await subscriptionModel.deleteById(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubscriptionsByUser = async (req, res) => {
  try {
    const subscriptions = await subscriptionModel.findBySubscriber(req.params.userId);
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};