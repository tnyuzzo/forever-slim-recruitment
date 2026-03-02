import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Returns the current user's role from user_roles table (bypasses RLS)
export async function GET() {
    try {
        const authClient = await createServerClient()
        const { data: { user } } = await authClient.auth.getUser()
        if (!user) {
            return NextResponse.json({ role: null }, { status: 401 })
        }

        const { data } = await supabaseAdmin
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single()

        return NextResponse.json({ role: data?.role || null, email: user.email || null })
    } catch {
        return NextResponse.json({ role: null }, { status: 500 })
    }
}
