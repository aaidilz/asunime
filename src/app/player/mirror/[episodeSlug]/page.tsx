'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VideoPlayer from '@/app/components/VideoPlayer';

interface Mirror {
  label: string;
  data_content: string;
}

interface MirrorGroup {
  quality: string;
  mirrors: Mirror[];
}

export default function MirrorPage() {
  const { episodeSlug } = useParams();
  const [mirrors, setMirrors] = useState<MirrorGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [playerHtml, setPlayerHtml] = useState('');
  const [loadingPlayer, setLoadingPlayer] = useState(false);

  useEffect(() => {
    const fetchMirror = async () => {
      try {
        const res = await axios.get(`/api/player/mirror?query=${episodeSlug}`);
        setMirrors(res.data.mirrors || []);
      } catch (error: unknown) {
        console.error(error);
        setError('Gagal memuat data mirror.');
      } finally {
        setLoading(false);
      }
    };

    if (episodeSlug) fetchMirror();
  }, [episodeSlug]);

  const handlePlay = async (label: string, dataContent: string) => {
    if (loadingPlayer) return;
    
    try {
      setLoadingPlayer(true);
      const res = await axios.get(`/api/player/video?query=${encodeURIComponent(dataContent)}`);
      setPlayerHtml(res.data.player);
      setActivePlayer(label);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat player.');
    } finally {
      setLoadingPlayer(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <AutorenewIcon className="animate-spin text-blue-500 text-4xl" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <p className="text-red-500 text-xl font-medium">{error}</p>
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Fixed Player Section */}
      {activePlayer && (
        <VideoPlayer html={playerHtml} />
      )}

      {/* Content Section */}
      <main 
        className={`max-w-4xl mx-auto px-4 pt-8 pb-6 ${activePlayer ? 'mt-[calc(56.25vw+100px)]' : 'mt-0'}`}
      >
        <div className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold mb-2">
            Streaming Mirror
          </h1>
          <p className="text-blue-400 font-medium truncate">
            {episodeSlug}
          </p>
        </div>

        {mirrors.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">Tidak Ada Mirror Tersedia</h3>
              <p className="text-gray-400">Coba periksa kembali atau refresh halaman</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {mirrors.map((group, idx) => (
              <div key={idx} className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-600 px-3 py-1 rounded-md text-sm font-semibold">
                    {group.quality}
                  </div>
                  <span className="ml-2 text-gray-400 text-sm">
                    {group.mirrors.length} sumber
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {group.mirrors.map((mirror, mIdx) => {
                    const isActive = activePlayer === mirror.label;
                    const isLoading = loadingPlayer && isActive;
                    
                    return (
                      <button
                        key={mIdx}
                        onClick={() => handlePlay(mirror.label, mirror.data_content)}
                        disabled={isLoading}
                        className={`
                          flex items-center justify-center gap-2
                          px-4 py-3 rounded-lg transition-all
                          ${isActive 
                            ? 'bg-blue-600 border border-blue-500' 
                            : 'bg-gray-700 hover:bg-gray-600'}
                          ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                      >
                        {isLoading ? (
                          <AutorenewIcon className="animate-spin" />
                        ) : (
                          <>
                            <PlayArrowIcon className="text-xs" />
                            <span className="truncate">{mirror.label}</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}