import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async compareSecrets(hash: string, secret: string): Promise<boolean> {
    const valid = await argon.verify(hash, secret);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return true;
  }

  private async generateToken(
    sub: string,
    email: string,
    type: 'refresh' | 'access',
  ): Promise<string> {
    const payload = { sub, email };
    const secret: string =
      this.config.get(type === 'refresh' ? 'REFRESH_SECRET' : 'JWT_SECRET') ||
      '';
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: type === 'refresh' ? '7d' : '15m',
      secret: secret,
    });
    return token;
  }

  async authenticateUser(id: string, email: string) {
    const access_token = await this.generateToken(id, email, 'access');
    // const refresh_token = await this.generateToken(id, email, 'refresh');

    // const hashedRefreshToken = await argon.hash(refresh_token);
    // await this.prisma.user.update({ where: { id }, data: {} });
    // await this.user.updateRefreshToken(id, hashedRefreshToken);
    return {
      access: { token: access_token, expiresIn: 15000 },
      // refresh: { token: refresh_token, expiresIn: 24000 },
    };
  }

  // async refreshToken(refresh_token: string): Promise<AuthResponse> {
  //   const { sub }: { sub: string } = this.jwtService.verify(refresh_token, {
  //     secret: this.config.get('REFRESH_SECRET') || '',
  //   });

  //   const user = await this.user.find(sub);
  //   if (!user || !user.refresh_token)
  //     throw new UnauthorizedException('Invalid refresh token');
  //   await this.compareSecrets(user.refresh_token, refresh_token);
  //   return this.authenticateUser(user.id as string, user.email);
  // }

  // async logout(id: string) {
  //   await this.user.updateRefreshToken(id, null);
  // }
}
