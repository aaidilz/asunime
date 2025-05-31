// src/app/components/AnimeCard.tsx
import Link from 'next/link';

export default function AnimeCard({ anime }: { anime: any }) {
    return (
        <Link href={`/anime/${encodeURIComponent(anime.link.split('/').filter(Boolean).pop())}`}>
            <div className="group bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700/50 hover:border-blue-500/30 flex flex-col h-full">
                <div className="relative pb-[140%] overflow-hidden">
                    <img
                        src={anime.thumbnail || '/placeholder.jpg'}
                        alt={anime.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg';
                            e.currentTarget.classList.add('object-contain');
                            e.currentTarget.classList.add('p-4');
                        }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
                        <h3 className="text-white font-bold line-clamp-2 text-sm sm:text-base">{anime.title}</h3>
                    </div>
                </div>

                <div className="p-3 bg-gray-800 flex flex-col flex-1 justify-between">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">{anime.status}</span>
                        <div className="flex items-center gap-1 text-amber-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span>{anime.rating || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                        {anime.genres.slice(0, 3).map((genre: string, idx: number) => (
                            <span
                                key={idx}
                                className="text-[10px] px-2 py-1 bg-gray-700/50 rounded-full text-gray-300"
                            >
                                {genre}
                            </span>
                        ))}
                        {anime.genres.length > 3 && (
                            <span className="text-[10px] px-2 py-1 bg-gray-700/50 rounded-full text-gray-300">
                                +{anime.genres.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}