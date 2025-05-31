import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
        const episodes: any[] = [];

        $('.episodelist ul li').each((_, liEl) => {
            const title = $(liEl).find('a').text().trim();
            const link = $(liEl).find('a').attr('href') || '';
            const date = $(liEl).find('.zeebr').text().trim();
            episodes.push({ title, link, date, img });
        });

        return NextResponse.json({ episodes }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            error: 'Gagal mengambil data',
            detail: error.message
        }, { status: 500 });
    }
}