// src/app/api/player/video/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { data_content } = await req.json();
    if (!data_content) {
      return NextResponse.json({ error: 'Parameter data_content wajib diisi.' }, { status: 400 });
    }

    // Decode base64
    const decoded = Buffer.from(data_content, 'base64').toString('utf-8');
    const { id, i, q } = JSON.parse(decoded);

    // Ambil nonce
    const nonceRes = await axios.post('https://otakudesu.lol/wp-admin/admin-ajax.php', {
      action: 'aa1208d27f29ca340c92c66d1926f13f',
    });
    const nonce = nonceRes.data?.data;

    if (!nonce) {
      return NextResponse.json({ error: 'Gagal mengambil nonce' }, { status: 500 });
    }

    // Request data stream final
    const action = '2a3505c93b0035d3f455df82bf976b84';
    const finalRes = await axios.post(
      'https://otakudesu.lol/wp-admin/admin-ajax.php',
      new URLSearchParams({ id, i, q, nonce, action })
    );

    return NextResponse.json({ player: finalRes.data });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal memproses video', detail: error.message }, { status: 500 });
  }
}
