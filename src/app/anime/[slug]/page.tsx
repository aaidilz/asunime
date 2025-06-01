// file: anime/[slug]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link'; // Import Link

const extractEpisodeSlug = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(part => part);
    return pathParts.length > 1 ? pathParts[pathParts.length - 1] : null;
  } catch {
    return null;
  }
};

interface Episode {
  title: string;
  link: string;
  date: string;
  img: string;
}

export default function AnimePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formattedTitle = slug.replace(/-/g, ' ');

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await axios.get(`/api/episode?query=${slug}`);
        const episodeList = Array.isArray(response.data.episodes)
          ? response.data.episodes
          : [];
        setEpisodes(episodeList);
      } catch (err) {
        setError('Gagal mengambil data episode');
        console.error('Error fetching episodes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [slug]);

  if (loading) return <p className="p-4">Memuat episode...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1)}
        </h1>
        <p className="mt-2 text-gray-400">Daftar Episode Tersedia</p>
      </div>

      {episodes.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-800/50 p-8 rounded-2xl inline-block">
            <svg className="w-16 h-16 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-300">Tidak Ada Episode Ditemukan</h3>
            <p className="mt-2 text-gray-500">Silakan coba judul anime lainnya</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {episodes.map((ep, idx) => {
            const episodeSlug = extractEpisodeSlug(ep.link);
            
            return episodeSlug ? (
              <Link
                key={idx}
                href={`/player/mirror/${episodeSlug}`}
                className="group bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 flex flex-col h-full"
              >
                {/* Konten tetap sama */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={ep.img || '/placeholder.jpg'}
                    alt={ep.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg';
                    }}
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <div className="mb-2">
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                      {ep.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {ep.title.includes('BATCH') && (
                        <span className="inline-flex items-center text-xs px-2.5 py-1 bg-green-900/40 text-green-300 rounded-full">
                          BATCH
                        </span>
                      )}
                      {ep.title.includes('End') && (
                        <span className="inline-flex items-center text-xs px-2.5 py-1 bg-red-900/40 text-red-300 rounded-full">
                          END
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-2 flex justify-between items-center border-t border-gray-700/50">
                    <span className="text-xs text-gray-400 font-medium">{ep.date}</span>
                    <span className="text-xs text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                      Watch →
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              // Fallback jika gagal ekstrak slug
              <a
                key={idx}
                href={ep.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 flex flex-col h-full"
              >
                {/* Konten yang sama */}
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}