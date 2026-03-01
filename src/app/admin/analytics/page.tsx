'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, TrendingUp, Users, Filter, ChevronDown, ChevronRight } from 'lucide-react'

type Candidate = {
  id: string
  created_at: string
  funnel: string | null
  status: string
  score_total: number | null
  priority: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  campaign_id: string | null
  adset_id: string | null
  ad_id: string | null
}

type GroupedRow = {
  key: string
  label: string
  donna: number
  uomo: number
  total: number
  avgScore: number
  highPriority: number
  children?: GroupedRow[]
}

const FUNNEL_COLORS = {
  donna: { bg: 'bg-pink-100', text: 'text-pink-700', bar: 'bg-pink-500' },
  uomo: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuovo',
  qualified: 'Qualificato',
  invited: 'Invitato',
  interview_booked: 'Colloquio',
  offer_sent: 'Offerta',
  hired: 'Assunto',
  rejected: 'Scartato',
}

type GroupBy = 'campaign' | 'adset' | 'ad' | 'source'

export default function AnalyticsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [groupBy, setGroupBy] = useState<GroupBy>('campaign')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [funnelFilter, setFunnelFilter] = useState<'all' | 'd' | 'u'>('all')
  const supabase = createClient()

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data } = await supabase
        .from('candidates')
        .select('id, created_at, funnel, status, score_total, priority, utm_source, utm_medium, utm_campaign, utm_content, utm_term, campaign_id, adset_id, ad_id')
        .not('email', 'eq', 'rejected@temp.com')
        .not('email', 'ilike', '%test%')
        .order('created_at', { ascending: false })

      if (data) setCandidates(data)
      setLoading(false)
    }
    fetchCandidates()
  }, [])

  const filtered = useMemo(() => {
    if (funnelFilter === 'all') return candidates
    return candidates.filter(c => c.funnel === funnelFilter)
  }, [candidates, funnelFilter])

  const grouped = useMemo((): GroupedRow[] => {
    const map = new Map<string, Candidate[]>()

    for (const c of filtered) {
      let key: string
      switch (groupBy) {
        case 'campaign':
          key = c.utm_campaign || c.campaign_id || '(diretto / organico)'
          break
        case 'adset':
          key = c.utm_term || c.adset_id || '(nessun adset)'
          break
        case 'ad':
          key = c.utm_content || c.ad_id || '(nessun ad)'
          break
        case 'source':
          key = c.utm_source || '(diretto)'
          break
      }
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(c)
    }

    return Array.from(map.entries())
      .map(([key, items]) => {
        const donna = items.filter(c => c.funnel === 'd').length
        const uomo = items.filter(c => c.funnel === 'u').length
        const scores = items.filter(c => c.score_total != null).map(c => c.score_total!)
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
        const highPriority = items.filter(c => c.priority === 'high').length

        // Build children by ad (if grouping by campaign)
        let children: GroupedRow[] | undefined
        if (groupBy === 'campaign') {
          const adMap = new Map<string, Candidate[]>()
          for (const c of items) {
            const adKey = c.utm_content || c.ad_id || '(nessun ad)'
            if (!adMap.has(adKey)) adMap.set(adKey, [])
            adMap.get(adKey)!.push(c)
          }
          if (adMap.size > 1 || (adMap.size === 1 && !adMap.has(key))) {
            children = Array.from(adMap.entries())
              .map(([adKey, adItems]) => ({
                key: `${key}::${adKey}`,
                label: adKey,
                donna: adItems.filter(c => c.funnel === 'd').length,
                uomo: adItems.filter(c => c.funnel === 'u').length,
                total: adItems.length,
                avgScore: (() => {
                  const s = adItems.filter(c => c.score_total != null).map(c => c.score_total!)
                  return s.length > 0 ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0
                })(),
                highPriority: adItems.filter(c => c.priority === 'high').length,
              }))
              .sort((a, b) => b.total - a.total)
          }
        }

        return { key, label: key, donna, uomo, total: items.length, avgScore, highPriority, children }
      })
      .sort((a, b) => b.total - a.total)
  }, [filtered, groupBy])

  const totals = useMemo(() => {
    const donna = filtered.filter(c => c.funnel === 'd').length
    const uomo = filtered.filter(c => c.funnel === 'u').length
    const scores = filtered.filter(c => c.score_total != null).map(c => c.score_total!)
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    const highPriority = filtered.filter(c => c.priority === 'high').length
    return { donna, uomo, total: filtered.length, avgScore, highPriority }
  }, [filtered])

  const statusBreakdown = useMemo(() => {
    const map: Record<string, { donna: number; uomo: number }> = {}
    for (const c of filtered) {
      const s = c.status || 'new'
      if (!map[s]) map[s] = { donna: 0, uomo: 0 }
      if (c.funnel === 'd') map[s].donna++
      else if (c.funnel === 'u') map[s].uomo++
      else map[s].donna++ // default to donna if no funnel
    }
    return map
  }, [filtered])

  const maxTotal = Math.max(...grouped.map(g => g.total), 1)

  const toggleExpand = (key: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary-main" />
            Analytics Ads
          </h1>
          <p className="text-sm text-text-muted mt-1">Performance lead per campagna, adset e ad</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider">Lead totali</div>
          <div className="text-2xl font-black text-text-main mt-1">{totals.total}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs font-medium text-pink-600 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-pink-500" /> Donna
          </div>
          <div className="text-2xl font-black text-text-main mt-1">{totals.donna}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs font-medium text-blue-600 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Uomo
          </div>
          <div className="text-2xl font-black text-text-main mt-1">{totals.uomo}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider">Score medio</div>
          <div className="text-2xl font-black text-text-main mt-1">{totals.avgScore}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs font-medium text-green-600 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Alta priorità
          </div>
          <div className="text-2xl font-black text-text-main mt-1">{totals.highPriority}</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-text-main mb-3">Breakdown per stato</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusBreakdown).map(([status, counts]) => (
            <div key={status} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
              <span className="text-xs font-bold text-text-main">{STATUS_LABELS[status] || status}</span>
              {counts.donna > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">{counts.donna}</span>
              )}
              {counts.uomo > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{counts.uomo}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
          {([['all', 'Tutti'], ['d', 'Donna'], ['u', 'Uomo']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFunnelFilter(val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                funnelFilter === val
                  ? val === 'd' ? 'bg-pink-100 text-pink-700'
                  : val === 'u' ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-text-main'
                  : 'text-text-muted hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
          {([['campaign', 'Campagna'], ['adset', 'Adset'], ['ad', 'Ad'], ['source', 'Source']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setGroupBy(val); setExpandedRows(new Set()) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                groupBy === val ? 'bg-primary-light text-primary-hover' : 'text-text-muted hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wider">
                  {groupBy === 'campaign' ? 'Campagna' : groupBy === 'adset' ? 'Adset' : groupBy === 'ad' ? 'Ad' : 'Source'}
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider w-20">Totale</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-pink-500 uppercase tracking-wider w-20">Donna</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-blue-500 uppercase tracking-wider w-20">Uomo</th>
                <th className="px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider hidden md:table-cell">Distribuzione</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider w-20 hidden sm:table-cell">Score</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wider w-16 hidden sm:table-cell">Top</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grouped.map((row) => {
                const isExpanded = expandedRows.has(row.key)
                const hasChildren = row.children && row.children.length > 0
                return (
                  <>
                    <tr
                      key={row.key}
                      className={`hover:bg-gray-50 transition-colors ${hasChildren ? 'cursor-pointer' : ''}`}
                      onClick={() => hasChildren && toggleExpand(row.key)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {hasChildren && (
                            isExpanded
                              ? <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0" />
                              : <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium text-text-main truncate max-w-[300px]" title={row.label}>
                            {row.label}
                          </span>
                        </div>
                      </td>
                      <td className="text-center px-4 py-3">
                        <span className="text-sm font-black text-text-main">{row.total}</span>
                      </td>
                      <td className="text-center px-4 py-3">
                        {row.donna > 0 && <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">{row.donna}</span>}
                      </td>
                      <td className="text-center px-4 py-3">
                        {row.uomo > 0 && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{row.uomo}</span>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1 h-5">
                          {row.donna > 0 && (
                            <div
                              className="h-full bg-pink-400 rounded-l-full transition-all"
                              style={{ width: `${(row.donna / maxTotal) * 100}%`, minWidth: '4px' }}
                            />
                          )}
                          {row.uomo > 0 && (
                            <div
                              className={`h-full bg-blue-400 transition-all ${row.donna === 0 ? 'rounded-l-full' : ''} rounded-r-full`}
                              style={{ width: `${(row.uomo / maxTotal) * 100}%`, minWidth: '4px' }}
                            />
                          )}
                        </div>
                      </td>
                      <td className="text-center px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm text-text-muted">{row.avgScore || '—'}</span>
                      </td>
                      <td className="text-center px-4 py-3 hidden sm:table-cell">
                        {row.highPriority > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">{row.highPriority}</span>
                        )}
                      </td>
                    </tr>
                    {/* Children rows (expanded) */}
                    {isExpanded && row.children?.map((child) => (
                      <tr key={child.key} className="bg-gray-50/50">
                        <td className="px-5 py-2.5 pl-12">
                          <span className="text-xs font-medium text-text-muted truncate max-w-[260px] block" title={child.label}>
                            ↳ {child.label}
                          </span>
                        </td>
                        <td className="text-center px-4 py-2.5">
                          <span className="text-xs font-bold text-text-main">{child.total}</span>
                        </td>
                        <td className="text-center px-4 py-2.5">
                          {child.donna > 0 && <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">{child.donna}</span>}
                        </td>
                        <td className="text-center px-4 py-2.5">
                          {child.uomo > 0 && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{child.uomo}</span>}
                        </td>
                        <td className="px-4 py-2.5 hidden md:table-cell">
                          <div className="flex items-center gap-1 h-4">
                            {child.donna > 0 && (
                              <div
                                className="h-full bg-pink-300 rounded-l-full"
                                style={{ width: `${(child.donna / maxTotal) * 100}%`, minWidth: '3px' }}
                              />
                            )}
                            {child.uomo > 0 && (
                              <div
                                className={`h-full bg-blue-300 ${child.donna === 0 ? 'rounded-l-full' : ''} rounded-r-full`}
                                style={{ width: `${(child.uomo / maxTotal) * 100}%`, minWidth: '3px' }}
                              />
                            )}
                          </div>
                        </td>
                        <td className="text-center px-4 py-2.5 hidden sm:table-cell">
                          <span className="text-xs text-text-muted">{child.avgScore || '—'}</span>
                        </td>
                        <td className="text-center px-4 py-2.5 hidden sm:table-cell">
                          {child.highPriority > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">{child.highPriority}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                )
              })}
              {grouped.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-text-muted">
                    Nessun lead trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
