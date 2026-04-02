'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'lg';
}

export default function SearchBar({
  placeholder = 'Search an address in Los Angeles...',
  className = '',
  size = 'sm',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/property/${encodeURIComponent(trimmed)}`);
  };

  const isLarge = size === 'lg';

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center ${className}`}
    >
      <Search
        className={`absolute left-3 text-slate-400 pointer-events-none ${
          isLarge ? 'h-5 w-5' : 'h-4 w-4'
        }`}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-slate-200 bg-white text-slate-700
          placeholder:text-slate-400 focus:border-teal focus:ring-2 focus:ring-teal/20
          focus:outline-none transition-colors ${
            isLarge
              ? 'pl-11 pr-4 py-3 text-base'
              : 'pl-9 pr-3 py-2 text-sm'
          }`}
      />
      <button
        type="submit"
        className={`absolute right-1.5 rounded-md bg-teal text-white font-medium
          hover:bg-teal-dark transition-colors ${
            isLarge
              ? 'px-4 py-1.5 text-sm'
              : 'px-3 py-1 text-xs'
          }`}
      >
        Search
      </button>
    </form>
  );
}
