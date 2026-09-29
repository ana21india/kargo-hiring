const PALETTE = [
  { bg: 'bg-emerald-400', text: 'text-emerald-950' },
  { bg: 'bg-indigo-400', text: 'text-indigo-950' },
  { bg: 'bg-amber-400', text: 'text-amber-950' },
  { bg: 'bg-rose-400', text: 'text-rose-950' },
  { bg: 'bg-sky-400', text: 'text-sky-950' },
  { bg: 'bg-violet-400', text: 'text-violet-950' },
]

export function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

export function getAvatarColor(name) {
  const str = name || ''
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}
