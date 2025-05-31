// src/components/VideoPlayer.tsx
'use client';

import React from 'react';

interface VideoPlayerProps {
  html: string;
}

export default function VideoPlayer({ html }: VideoPlayerProps) {
  return (
    <div className="aspect-video w-full bg-black relative overflow-hidden rounded-lg">
      <div
        className="w-full h-full responsive-iframe absolute top-0 left-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
