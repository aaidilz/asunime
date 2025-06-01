'use client';

import { useState } from 'react';
import axios from 'axios';
import AnimeCard from './components/AnimeCard';

interface Anime {
    title: string;
    link: string;
    thumbnail: string;
    genres: string[];
    status: string;
    rating: string;
}

export default function Home() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Masukkan judul anime terlebih dahulu.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`/api/anime?query=${encodeURIComponent(query)}`);
            setResults(res.data.results);
        } catch (err) {
            console.error(err);
            setError('Gagal mengambil hasil pencarian.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                    Cari Anime
                </h1>
                <p className="text-gray-400 text-sm">Powered by Otakudesu</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full p-4 pl-12 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/30 text-white shadow-lg transition-all duration-300"
                        placeholder="Contoh: one piece..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button
                    onClick={handleSearch}
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl font-medium text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Cari</span>
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300 flex items-center gap-3">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Mencari anime...</p>
                </div>
            )}

            {results.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {results.map((anime: Anime, index: number) => (
                        <AnimeCard key={index} anime={anime} />
                    ))}
                </div>
            ) : !loading && (
                <div className="text-center py-12">
                    <div className="bg-gray-800/50 p-6 rounded-2xl inline-block">
                        <svg className="w-16 h-16 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-gray-300">Belum ada hasil</h3>
                        <p className="mt-2 text-gray-500">Cari anime favoritmu di atas</p>
                    </div>
                </div>
            )}
        </main>
    );
}
