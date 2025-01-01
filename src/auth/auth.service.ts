import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import * as crypto from 'crypto';
import { LoginDto, RegisterDto, VerifyEmailDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;
  private readonly encryptionKey: string;

  constructor(private jwtService: JwtService) {
    this.prisma = new PrismaClient();
    this.encryptionKey = process.env.ENCRYPTION_KEY;
  }

  private encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
  }

  private decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private generateOTP(): string {
    // Generate a cryptographically secure 6-digit OTP
    const buffer = crypto.randomBytes(4); // 4 bytes = 32 bits
    const otpNumber = parseInt(buffer.toString('hex'), 16) % 1000000;
    return otpNumber.toString().padStart(6, '0');
  }

  private generateOTPHash(otp: string, email: string): string {
    // Create a hash of OTP with email as salt for additional security
    return crypto
      .createHmac('sha256', this.encryptionKey)
      .update(`${otp}${email}`)
      .digest('hex');
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const otp = this.generateOTP();
    const otpHash = this.generateOTPHash(otp, registerDto.email);
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        firstName: this.encrypt(registerDto.firstName),
        lastName: this.encrypt(registerDto.lastName),
        otpCode: otpHash,
        otpExpires,
      },
    });

    // TODO: Send email with OTP
    console.log('OTP for testing:', otp);

    return {
      message: 'Registration successful. Please verify your email.',
      userId: user.id,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: this.decrypt(user.firstName),
        lastName: this.decrypt(user.lastName),
      },
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: verifyEmailDto.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    if (!user.otpCode || !user.otpExpires || user.otpExpires < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    const otpHash = this.generateOTPHash(
      verifyEmailDto.otp,
      verifyEmailDto.email,
    );
    if (user.otpCode !== otpHash) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        otpCode: null,
        otpExpires: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isEmailVerified: true,
      },
    });
  }
}
