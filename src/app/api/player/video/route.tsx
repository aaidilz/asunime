import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const data_content = req.nextUrl.searchParams.get('query');
    if (!data_content) {
      return NextResponse.json({ error: 'Parameter data_content wajib diisi.' }, { status: 400 });
    }

    // Decode base64 ke JSON
    const decoded = JSON.parse(Buffer.from(data_content, 'base64').toString('utf-8'));
    const { id, i, q } = decoded;

    // Request nonce dulu
    const nonceRes = await axios.post(
      'https://otakudesu.cloud/wp-admin/admin-ajax.php',
      new URLSearchParams({ action: 'aa1208d27f29ca340c92c66d1926f13f' }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const nonce = nonceRes.data?.data;
    if (!nonce) {
      return NextResponse.json({ error: 'Gagal mendapatkan nonce' }, { status: 500 });
    }

    // Request data player dengan nonce dan param
    const action = '2a3505c93b0035d3f455df82bf976b84';
    const finalRes = await axios.post(
      'https://otakudesu.cloud/wp-admin/admin-ajax.php',
      new URLSearchParams({
        id: id.toString(),
        i: i.toString(),
        q: q.toString(),
        nonce,
        action,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const base64Player = finalRes.data?.data;
    if (!base64Player) {
      return NextResponse.json({ error: 'Gagal mendapatkan player' }, { status: 500 });
    }

    // Decode base64 player jadi iframe HTML
    let decodedIframe = Buffer.from(base64Player, 'base64').toString('utf-8');
    // Adjust width and height attributes in the iframe
    decodedIframe = decodedIframe.replace(
      /<iframe([^>]*)width="[^"]*"([^>]*)height="[^"]*"([^>]*)>/i,
      '<iframe$1width="100%"$2height="480"$3>'
    );

    return NextResponse.json({ player: decodedIframe });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'Gagal memproses video',
        detail: message,
      },
      { status: 500 }
    );
  }
}
