/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setup() {
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const tony = users.find(u => u.email === 'tonytodavida@gmail.com');
    if (!tony) { console.log('Utente non trovato!'); return; }
    console.log('User ID:', tony.id);

    const { error } = await supabase.from('user_roles').upsert({
        user_id: tony.id,
        role: 'superadmin'
    }, { onConflict: 'user_id' });

    if (error) console.log('Errore:', error.message);
    else console.log('Ruolo superadmin assegnato!');

    const { data: roles } = await supabase.from('user_roles').select('*');
    console.log('Ruoli:', JSON.stringify(roles, null, 2));
}
setup().catch(console.error);
