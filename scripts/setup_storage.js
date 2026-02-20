require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
    console.log('1. Creating candidate-audio bucket...')

    // We use the storage API rather than raw SQL since Supabase client exposes it directly
    const { data: buckets, error: getError } = await supabase.storage.listBuckets()
    if (getError) {
        console.error('Error listing buckets:', getError)
        return
    }

    const bucketExists = buckets.find(b => b.name === 'candidate-audio')

    if (!bucketExists) {
        const { data, error } = await supabase.storage.createBucket('candidate-audio', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
        })

        if (error) {
            console.error('Failed to create bucket:', error)
        } else {
            console.log('Bucket created successfully:', data)
        }
    } else {
        console.log('Bucket already exists.')
        // Let's ensure it's public just in case
        const { error: updateError } = await supabase.storage.updateBucket('candidate-audio', {
            public: true,
        })
        if (updateError) {
            console.error('Error updating bucket to public:', updateError)
        } else {
            console.log('Bucket ensured to be public.')
        }
    }

    // To set RLS policies, we unfortunately still need raw SQL, which the rest API doesn't expose easily without an RPC function.
    // HOWEVER, by default, if a bucket is marked as "Public" via the storage API (which we just did), 
    // read access is granted. For insert access (Anon users), we can either use the service role key on the frontend (BAD) 
    // or use SQL to grant Anon insert privileges.

    console.log('Running SQL policies...')
    // Using an RPC call if the user had it, otherwise we'll instruct them to run the SQL snippet or try postgres direct connection if we had the connection string.
    // Since we don't have the direct postgres:// connection string in the env (only the REST URL), we cannot run arbitrary SQL via the supabase client.
}

setupStorage()
