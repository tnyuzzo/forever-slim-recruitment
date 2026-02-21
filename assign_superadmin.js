const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    'https://fxvnzxxioqpxrvownjag.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dm56eHhpb3FweHJ2b3duamFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDAyMzMyNCwiZXhwIjoyMDg1NTk5MzI0fQ.EH_ruvNvXqJ4WfO6Rb7-E-xM1uvM0JoKixnc8u4hFdI'
);

async function setup() {
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const tony = users.find(u => u.email === 'tonytodavida@gmail.com');
    if (!tony) { console.log('Utente non trovato!'); return; }
    console.log('User ID:', tony.id);

    const { data, error } = await supabase.from('user_roles').upsert({
        user_id: tony.id,
        role: 'superadmin'
    }, { onConflict: 'user_id' });

    if (error) console.log('Errore:', error.message);
    else console.log('Ruolo superadmin assegnato!');

    const { data: roles } = await supabase.from('user_roles').select('*');
    console.log('Ruoli:', JSON.stringify(roles, null, 2));
}
setup().catch(console.error);
