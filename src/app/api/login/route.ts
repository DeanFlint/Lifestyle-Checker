import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nhsnum = searchParams.get('nhsnum');

    if (!nhsnum) {
      return NextResponse.json({ error: 'nhsnum is required' }, { status: 400 });
    }

    const upstream = await fetch(
      `${process.env.API_BASE_URL}/${encodeURIComponent(nhsnum)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': process.env.API_KEY || '',
        },
      },
    );

    if (!upstream.ok) {
      const error = await upstream.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.message ?? 'Login failed' },
        { status: upstream.status },
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}