import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";  // ← add the curly braces

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(
      { status: "ok", message: "DB pinged successfully", timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ping failed:", error);
    return NextResponse.json(
      { status: "error", message: "DB ping failed" },
      { status: 500 }
    );
  }
}