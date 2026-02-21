import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Verifica se l'utente è un 'superadmin' guardando la tabella user_roles
export async function isSuperAdmin(userId: string): Promise<boolean> {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                // We only use this for checking, so setting cookies isn't strictly necessary here
                setAll(cookiesToSet) {
                    // Ignored in read-only mode
                },
            },
        }
    )

    const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single()

    if (error || !data) return false
    return data.role === 'superadmin'
}

export async function getUserRole(userId: string): Promise<'superadmin' | 'recruiter' | null> {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                },
            },
        }
    )

    const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single()

    if (error || !data) return null
    return data.role as 'superadmin' | 'recruiter'
}
