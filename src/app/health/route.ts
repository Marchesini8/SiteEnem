import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "guia-definitivo-enem-2026",
  });
}
