import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface Episode {
    title: string;
    link: string;
    date: string;
    img: string;
}

export async function GET(req: NextRequest) {
    const animeUrl = req.nextUrl.searchParams.get('query');

    if (!animeUrl) {
        return NextResponse.json({ error: 'Parameter url wajib diisi.' }, { status: 400 });
    }

    try {
        const url = `https://otakudesu.cloud/anime/${encodeURIComponent(animeUrl)}`;
        const response = await axios.get(url);
        const html = response.data.contents || response.data;
        const $ = cheerio.load(html);

        const img = $('.fotoanime img').attr('src') || '';
        const episodes: Episode[] = [];

        $('.episodelist ul li').each((_, liEl) => {
            const title = $(liEl).find('a').text().trim();
            const link = $(liEl).find('a').attr('href') || '';
            const date = $(liEl).find('.zeebr').text().trim();
            episodes.push({ title, link, date, img });
        });

        return NextResponse.json({ episodes }, { status: 200 });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({
            error: 'Gagal mengambil data',
            detail: message
        }, { status: 500 });
    }
}