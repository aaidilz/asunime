// src/app/api/player/mirrors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req: NextRequest) {
  const episodeUrl = req.nextUrl.searchParams.get('query');

  if (!episodeUrl) {
    return NextResponse.json({ error: 'Parameter url wajib diisi.' }, { status: 400 });
  }

  try {
    const url = `https://otakudesu.cloud/episode/${encodeURIComponent(episodeUrl)}`;
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    const qualities = ['m360p', 'm480p', 'm720p'];
    const mirrors = qualities.map((className) => {
      const ul = $(`div.mirrorstream > ul.${className}`);
      const links = ul.find('li > a').map((_, el) => {
        return {
          label: $(el).text().trim(),
          url: $(el).attr('href') || '',
        };
      }).get();

      return {
        quality: className.replace('m', '') + 'p',
        mirrors: links,
      };
    });

    return NextResponse.json({ mirrors });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Gagal mengambil data mirror stream',
      detail: error.message,
    }, { status: 500 });
  }
}
