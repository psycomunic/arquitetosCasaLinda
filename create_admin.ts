
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfpzxxtptrlttvzymqto.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcHp4eHRwdHJsdHR2enltcXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjUyMDEsImV4cCI6MjA4NDM0MTIwMX0.Nsydjy1Tt2uRcFY4vLi3x1iGLBwytzaLWwgUqoGoVZY'; // Anon key is fine for signUp
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const email = 'psycomunic@gmail.com';
    const password = 'Aa84809966*';

    console.log('Creating admin user...');

    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Administrador'
            }
        }
    });

    if (error) {
        console.error('Error creating user:', error);
        return;
    }

    if (!data.user) {
        console.error('No user returned');
        return;
    }

    console.log('Auth user created:', data.user.id);

    // 2. Insert Profile (simulating Register.tsx logic but with admin flags)
    // Note: We need to make sure the ID matches
    const { error: profileError } = await supabase
        .from('architects')
        .insert({
            id: data.user.id,
            email: email,
            name: 'Administrador',
            office_name: 'Casa Linda - Admin',
            approval_status: 'approved',
            is_admin: true, // This is the key
            commission_rate: 0,
            total_earnings: 0
        });

    if (profileError) {
        console.error('Error creating profile:', profileError);
    } else {
        console.log('Admin profile created successfully!');
    }
}

createAdmin();
