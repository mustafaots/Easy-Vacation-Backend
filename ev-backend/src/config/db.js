import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Get the connection string from Supabase
const connectionString = process.env.DATABASE_URL;

// Create a connection pool
const sql = postgres(connectionString, {
  idle_timeout: 20,      // Close idle connections after 20 seconds
  max_lifetime: 60 * 30, // Close connections after 30 minutes
  debug: process.env.NODE_ENV === 'development'
});

export default sql;