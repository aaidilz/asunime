import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Parameter query wajib diisi.' }, { status: 400 });
    }

    try {
        const url = `https://otakudesu.cloud/?s=${encodeURIComponent(query)}&post_type=anime`;

        const response = await axios.get(url, {
            headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9',
            },
        });
        const html = response.data.contents || response.data;

        const $ = cheerio.load(html);

        const results = $('ul.chivsrc > li').map((_, el) => {
            const element = $(el);

            const title = element.find('h2 > a').text().trim();
            const link = element.find('h2 > a').attr('href') || '';
            const thumbnail = element.find('img').attr('src') || '';
            const genres = element.find('.set').eq(0).find('a').map((_, g) => $(g).text()).get();
            const status = element.find('.set').eq(1).text().replace('Status :', '').trim();
            const rating = element.find('.set').eq(2).text().replace('Rating :', '').trim();

            return {
                title,
                link,
                thumbnail,
                genres,
                status,
                rating,
            };
        }).get();

        return NextResponse.json({ results });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({
            error: 'Gagal mengambil data',
            detail: message
        }, { status: 500 });
    }
}
