import * as CryptoJS from 'crypto-js';
import * as crypto from 'crypto';

export class CryptoUtil {
  static encrypt(text: string, key: string): string {
    return CryptoJS.AES.encrypt(text, key).toString();
  }

  static decrypt(encryptedText: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static generateOTP(): string {
    const buffer = crypto.randomBytes(4);
    const otpNumber = parseInt(buffer.toString('hex'), 16) % 1000000;
    return otpNumber.toString().padStart(6, '0');
  }

  static generateOTPHash(otp: string, email: string, key: string): string {
    return crypto
      .createHmac('sha256', key)
      .update(`${otp}${email}`)
      .digest('hex');
  }
}
