'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { GeoCoordinates } from '@/types/geo';
import { LocationSuggestion } from '@/lib/location';

interface LocationSearchProps {
  onSelectCallback: (coords: GeoCoordinates, displayName: string, provider?: string, fullSuggestion?: LocationSuggestion) => void;
  messages?: any;
}

export default function LocationSearch({ onSelectCallback, messages }: LocationSearchProps) {
  const t = messages?.tool || {};
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isSelected, setIsSelected] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const performSearch = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setNoResults(false);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`);
      
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error('Invalid JSON response');
      }

      if (res.ok) {
        // Tag exactMatch if query has numbers and result has house number
        const hasNumber = /\d/.test(searchQuery);
        const mappedResults = (data.results || []).map((r: any) => ({
           ...r,
           exactMatch: hasNumber && !r.houseNumber ? false : true,
        }));
        setResults(mappedResults);
        setIsOpen(true);
        if (mappedResults.length === 0) {
          setNoResults(true);
          setErrorMessage('No matching locations found. Try adding city or country.');
        }
      } else {
        console.error('API Error:', data);
        setErrorMessage(data.error || 'Location search is temporarily unavailable.');
        setNoResults(true);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Search failed', error);
      setErrorMessage('Search failed to connect');
      setNoResults(true);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Debounce search
  useEffect(() => {
    if (isSelected) return; // Skip fetch if the query change was due to selection
    
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
        setFocusedIndex(-1);
      } else {
        setResults([]);
        setIsOpen(false);
        setNoResults(false);
        setFocusedIndex(-1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, performSearch, isSelected]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (r: LocationSuggestion) => {
    onSelectCallback({ lat: r.lat, lng: r.lon }, r.displayName, r.provider, r);
    setIsSelected(true);
    setQuery(r.displayName);
    setIsOpen(false);
    setResults([]);
    setFocusedIndex(-1);
  };

  const handleClear = () => {
    setIsSelected(false);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setNoResults(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < results.length) {
        handleSelect(results[focusedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <div className="relative flex-grow">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setIsSelected(false);
            setQuery(e.target.value);
            setFocusedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t.searchAddress || "Search address, street, city, area, landmark or business name..."}
          className="w-full ps-10 pe-10 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        <Search className="absolute start-3 top-3 text-slate-400 w-4 h-4" />
        
        {loading && (
          <div className="absolute end-3 top-2.5">
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          </div>
        )}
        
        {!loading && query.length > 0 && (
          <button 
            type="button" 
            onClick={handleClear}
            className="absolute end-3 top-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (results.length > 0 || noResults) && (
        <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-[300px] overflow-auto">
          {noResults ? (
            <li className="px-4 py-8 text-center text-slate-500 text-sm">
              {errorMessage ? `Error: ${errorMessage}` : 'No locations found'}
            </li>
          ) : (
            results.map((r, i) => (
              <li key={`${r.id}-${i}`}>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-slate-50 last:border-0 ${focusedIndex === i ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                  onClick={() => handleSelect(r)}
                  onMouseEnter={() => setFocusedIndex(i)}
                >
                  <MapPin className="text-slate-400 w-4 h-4 mt-1 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-slate-800 line-clamp-1">{r.displayName}</span>
                    <span className="text-xs text-slate-500 line-clamp-1">
                      {[r.city, r.state, r.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
