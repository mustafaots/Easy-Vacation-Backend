import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import supabase from './config/supabaseClient.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import reviewRoutes from './routes/review.routes.js';
import reportRoutes from './routes/report.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function testConnection() {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('Connected to Supabase');
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
}

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, username')
      .limit(5);

    if (usersError) throw usersError;

    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, category')
      .limit(5);

    if (postsError) throw postsError;

    res.json({ success: true, users: users || [], posts: posts || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await testConnection();
});