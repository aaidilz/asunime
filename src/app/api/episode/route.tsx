import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

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
        const jar = new CookieJar();
        const client = wrapper(axios.create({ jar }));
        const url = `https://otakudesu.cloud/anime/${encodeURIComponent(animeUrl)}`;
        const response = await client.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9',
                'referer': 'https://otakudesu.cloud/',
            },
        });
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