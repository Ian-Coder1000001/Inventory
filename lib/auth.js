import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export async function getSession(request) {
  try {
    // 1. Check Authorization Bearer header (used by frontend fetch calls)
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const session = verifyToken(token);
      if (session) return session;
    }

    // 2. Fallback: check cookie header string
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    if (match) {
      const session = verifyToken(decodeURIComponent(match[1]));
      if (session) return session;
    }

    return null;
  } catch {
    return null;
  }
}