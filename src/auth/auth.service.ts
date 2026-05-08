import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = (await this.usersService.findByEmail(email)) as UserDocument;
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      if (!user.isActive) {
        throw new UnauthorizedException(
          'Usuario inactivo. Contacte con soporte.',
        );
      }
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
