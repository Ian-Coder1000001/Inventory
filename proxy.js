// proxy.js  ← rename this file (move it to root, same location)
import { NextResponse } from 'next/server';

export function proxy() {
  return NextResponse.next();
}