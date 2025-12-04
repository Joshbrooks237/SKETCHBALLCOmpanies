import { authenticator } from 'otplib';
import QRCode from 'qrcode';

const APP_NAME = 'SketchFactor';

export function generateSecret(): string {
  return authenticator.generateSecret();
}

export function verifyToken(secret: string, token: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

export function generateToken(secret: string): string {
  return authenticator.generate(secret);
}

export async function generateQRCode(email: string, secret: string): Promise<string> {
  const otpauth = authenticator.keyuri(email, APP_NAME, secret);
  return QRCode.toDataURL(otpauth);
}

export function getOtpauthUrl(email: string, secret: string): string {
  return authenticator.keyuri(email, APP_NAME, secret);
}

