import { NextResponse } from "next/server";
import * as ytdl from "ytdl-core";

export async function POST(request: Request) {
  const body = await request.json();
  const info = await ytdl.getInfo(body.url);
  return NextResponse.json(info, { status: 200 });
}
