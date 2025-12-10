import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    console.log('\n📡 Connecting to Supabase...');
    
    // Test 1: Simple connection test
    const { data: versionData, error: versionError } = await supabase.rpc('version');
    if (!versionError) {
      console.log('✅ Supabase connection successful');
    }
    
    // Test 2: Count users
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting users:', countError.message);
      console.log('Error details:', countError);
    } else {
      console.log(`📊 Total users in database: ${count}`);
    }
    
    // Test 3: Get all users (to see what's there)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, email')
      .limit(10);
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
    } else {
      console.log('\n👥 Users found:');
      if (users && users.length > 0) {
        users.forEach(user => {
          console.log(`  ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`);
        });
      } else {
        console.log('  No users found in the table');
      }
    }
    
    // Test 4: Check if table exists
    const { error: tableError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') {
      console.error('\n❌ Table "users" does not exist!');
      console.log('Make sure you created the table in the correct database/schema.');
    }
    
  } catch (error) {
    console.error('\n💥 Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if .env file exists in the correct location');
    console.log('2. Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct');
    console.log('3. Check your internet connection');
    console.log('4. Make sure your IP is allowed in Supabase (Settings → Database)');
  }
}

testConnection();