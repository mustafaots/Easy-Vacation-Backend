import 'dotenv/config';
import readline from 'readline';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/auth';

// Load saved token from session storage (browser) or file (Node.js)
let currentToken = null;
let currentUser = null;

// Check if token is valid by verifying with Supabase
const verifyToken = async (token) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.log('❌ Token invalid:', error.message);
      return null;
    }
    
    return user;
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return null;
  }
};

// Try to restore session from browser localStorage or sessionStorage
const restoreSession = async () => {
  try {
    // In Node.js, we could read from a file or env variable
    // For now, we'll start fresh each time
    return null;
    
    // If you want to save between runs, use:
    // import fs from 'fs';
    // const STATE_FILE = 'session.json';
    // if (fs.existsSync(STATE_FILE)) {
    //   const saved = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    //   const validUser = await verifyToken(saved.token);
    //   if (validUser) {
    //     currentToken = saved.token;
    //     currentUser = validUser;
    //     return validUser;
    //   }
    // }
  } catch (error) {
    return null;
  }
};

// Simple question function
const ask = (question) => new Promise(resolve => {
  rl.question(question, answer => resolve(answer.trim()));
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fetch user profile from your database
const fetchUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)  // or eq('auth_id', userId) depending on your schema
      .single();
    
    if (error) {
      console.log('Could not fetch user profile:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.log('Profile fetch error:', error.message);
    return null;
  }
};

// API functions
const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, token } = options;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(json.error || `HTTP ${res.status}`);
      err.status = res.status;
      err.payload = json;
      throw err;
    }
    return json;
  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
};

// Login function
const login = async (email, password) => {
  try {
    console.log('\n🔐 Logging in...');
    
    // Option 1: Use Supabase Auth directly
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.log('❌ Login failed:', error.message);
      return null;
    }
    
    console.log('✅ Login successful!');
    currentToken = data.session.access_token;
    currentUser = data.user;
    
    // Get user profile from your database
    const profile = await fetchUserProfile(data.user.id);
    if (profile) {
      console.log(`👤 Welcome, ${profile.username || profile.email}!`);
      console.log(`   User type: ${profile.user_type}`);
    } else {
      console.log(`👤 Welcome, ${data.user.email}!`);
    }
    
    return data;
    
  } catch (error) {
    console.error('Login error:', error.message);
    return null;
  }
};

// Signup function  
const signup = async (email, password, username) => {
  try {
    console.log('\n📝 Signing up...');
    
    // Option 1: Use Supabase Auth directly
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });
    
    if (error) {
      console.log('❌ Signup failed:', error.message);
      return null;
    }
    
    console.log('✅ Signup successful!');
    console.log(`📧 Check your email for confirmation: ${email}`);
    
    // Note: User won't have a session until they confirm email
    // So we don't auto-login here
    
    return data;
    
  } catch (error) {
    console.error('Signup error:', error.message);
    return null;
  }
};

// Logout function
const logout = async () => {
  if (!currentToken) {
    console.log('❌ No active session');
    return false;
  }
  
  try {
    console.log('\n🚪 Logging out...');
    
    // Option 1: Use Supabase Auth directly
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.log('❌ Logout failed:', error.message);
      // Still clear local session
      currentToken = null;
      currentUser = null;
      return false;
    }
    
    console.log('✅ Logged out successfully!');
    currentToken = null;
    currentUser = null;
    return true;
    
  } catch (error) {
    console.error('Logout error:', error.message);
    // Still clear local session
    currentToken = null;
    currentUser = null;
    return false;
  }
};

// Check current session
const checkSession = async () => {
  if (!currentToken) {
    return false;
  }
  
  const user = await verifyToken(currentToken);
  if (!user) {
    currentToken = null;
    currentUser = null;
    return false;
  }
  
  return true;
};

// Main loop
async function main() {
  console.clear();
  console.log('🔐 Auth Console (Supabase Powered)\n');
  
  // Try to restore any valid session
  await restoreSession();
  
  // Check if current token is still valid
  if (currentToken) {
    const isValid = await checkSession();
    if (isValid) {
      console.log(`✅ Valid session for: ${currentUser?.email || 'User'}\n`);
    } else {
      console.log('❌ Session expired or invalid\n');
    }
  }
  
  while (true) {
    console.log('\n' + '='.repeat(40));
    console.log('MAIN MENU');
    console.log('='.repeat(40));
    
    const hasValidSession = currentToken && await checkSession();
    
    if (hasValidSession) {
      console.log(`👤 Logged in as: ${currentUser?.email || 'User'}`);
      console.log('1. View Profile');
      console.log('2. Logout');
      console.log('3. Check Session Status');
      console.log('4. Exit');
    } else {
      console.log('1. Sign Up');
      console.log('2. Login');
      console.log('3. Exit');
    }
    
    const choice = await ask('\nChoose: ');
    
    if (hasValidSession) {
      switch (choice) {
        case '1': // View Profile
          console.log('\n📋 Your Profile:');
          console.log(`- Email: ${currentUser?.email}`);
          console.log(`- User ID: ${currentUser?.id}`);
          console.log(`- Email verified: ${currentUser?.email_confirmed_at ? 'Yes' : 'No'}`);
          
          // Fetch additional profile info from your database
          const profile = await fetchUserProfile(currentUser.id);
          if (profile) {
            console.log('\n📊 Database Profile:');
            console.log(`- Username: ${profile.username}`);
            console.log(`- User Type: ${profile.user_type}`);
            console.log(`- Verified: ${profile.is_verified ? 'Yes' : 'No'}`);
          }
          break;
          
        case '2': // Logout
          await logout();
          break;
          
        case '3': // Check Session
          const valid = await checkSession();
          console.log(valid ? '✅ Session is valid' : '❌ Session is invalid');
          break;
          
        case '4': // Exit
          console.log('\n👋 Goodbye!');
          rl.close();
          return;
          
        default:
          console.log('❌ Invalid choice');
      }
    } else {
      switch (choice) {
        case '1': // Sign Up
          console.log('\n' + '='.repeat(40));
          console.log('SIGN UP');
          console.log('='.repeat(40));
          
          const signupEmail = await ask('Email: ');
          const signupUsername = await ask('Username: ');
          const signupPassword = await ask('Password: ');
          
          if (!signupEmail || !signupUsername || !signupPassword) {
            console.log('❌ All fields are required');
            break;
          }
          
          await signup(signupEmail, signupPassword, signupUsername);
          break;
          
        case '2': // Login
          console.log('\n' + '='.repeat(40));
          console.log('LOGIN');
          console.log('='.repeat(40));
          
          const loginEmail = await ask('Email: ');
          const loginPassword = await ask('Password: ');
          
          if (!loginEmail || !loginPassword) {
            console.log('❌ Email and password required');
            break;
          }
          
          await login(loginEmail, loginPassword);
          break;
          
        case '3': // Exit
          console.log('\n👋 Goodbye!');
          rl.close();
          return;
          
        default:
          console.log('❌ Invalid choice');
      }
    }
  }
}

// Handle cleanup
rl.on('close', () => {
  console.log('\n👋 Application closed.');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Application interrupted. Goodbye!');
  rl.close();
});

// Run the app
main().catch(error => {
  console.error('Fatal error:', error);
  rl.close();
  process.exit(1);
});