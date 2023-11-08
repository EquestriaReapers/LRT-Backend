import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UsersService } from 'src/users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UserRole } from 'src/constants';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register({ email, password, name }: RegisterDto) {
        const user = await this.usersService.findOneByEmail(email);

        if (user) {
            throw new BadRequestException('User already exists');
        }

        await this.usersService.create({
            email,
            password: await bcryptjs.hash(password, 10),
            name,
            role: UserRole.GRADUATE,
        });
  

        return {
            email,
            name
        }
    }

    async login({ email, password }: LoginDto) {
        
        const user = await this.usersService.findByEmailWithPassword(email);
        if (!user) {
            throw new UnauthorizedException('email is wrong');
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('password is wrong');
        }

        const payload = { email: user.email, id: user.id, role: user.role };
        const token = await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET});


        return {
            token,
            email,
            role: user.role,
            id: user.id,
        }
    }
}
