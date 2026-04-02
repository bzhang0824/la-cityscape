'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface SearchBarProps {
  /** Initial value pre-populated in the input */
  initialValue?: string
  /** Additional class names applied to the wrapper element */
  className?: string
}

export default function SearchBar({ initialValue = '', className = '' }: SearchBarProps) {
  const router = useRouter()
  const [address, setAddress] = useState(initialValue)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = address.trim()
    if (!trimmed) return
    router.push(`/property/${encodeURIComponent(trimmed)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`flex items-center gap-3 bg-white rounded-xl shadow-md border border-slate-200 px-4 py-3 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all ${className}`}
    >
      <Search className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
      <input
        type="search"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Search any LA address..."
        aria-label="Search LA address"
        className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-sm outline-none"
      />
      <button
        type="submit"
        disabled={!address.trim()}
        className="shrink-0 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
      >
        Search
      </button>
    </form>
  )
}
