import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UserRole } from '../../../constants';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerificationEntity } from '../entities/emailverification.entity';
import { In, Repository } from 'typeorm';
import { JwtPayload } from '../interface/jwt-payload.interface';
import 'dotenv/config';
import { JwtPayloadService } from '../../../common/service/jwt.payload.service';
import { transporter } from '../../../constants';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { USER_NOT_FOUND } from 'src/core/users/messages';
import * as nodemailer from 'nodemailer';
import {
  INVALID_TOKEN_EMAIL_MESSAGE,
  SUCCESSFULY_SEND_EMAIL_VERIFICATION_MESSAGE,
  UNAUTHROIZED_BAD_REQUEST_MESSAGE,
  USER_ALREADY_EXISTS_MESSAGE,
} from '../message';
import { ForgotPassword } from '../entities/forgotpassword.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerification: Repository<EmailVerificationEntity>,

    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,

    private readonly jwtPayloadService: JwtPayloadService,

    @InjectRepository(ForgotPassword)
    private readonly forgotPassword: Repository<ForgotPassword>,

  ) { }

  async register({ email, password, name, lastname }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException(USER_ALREADY_EXISTS_MESSAGE);
    }

    await this.usersService.create({
      email,
      password: await bcryptjs.hash(password, 10),
      name,
      lastname,
      role: UserRole.GRADUATE,
    });

    return {
      email,
      name,
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException(UNAUTHROIZED_BAD_REQUEST_MESSAGE);
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!user.verified) {
      throw new UnauthorizedException(UNAUTHROIZED_BAD_REQUEST_MESSAGE);
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException(UNAUTHROIZED_BAD_REQUEST_MESSAGE);
    }

    const payload = { email: user.email, id: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      token,
      email,
      role: user.role,
      id: user.id,
    };
  }

  async createEmailToken(email: string) {
    const emailVerification = await this.emailVerification.findOne({
      where: { email: email },
    });

    const RANDOM_NUMBER = Math.floor(Math.random() * 9000000) + 1000000;

    if (!emailVerification) {
      const emailVerificationToken = await this.emailVerification.save({
        email,
        emailToken: RANDOM_NUMBER.toString(),
        timestamp: new Date(),
      });
      return emailVerificationToken;
    }
    return false;
  }

  async validateUserByJwt(payload: JwtPayload) {
    const user = await this.usersService.findOneByEmail(payload.email);

    if (user) {
      return this.jwtPayloadService.createJwtPayload(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    const emailVerif = await this.emailVerification.findOne({
      where: { emailToken: token },
    });
    if (emailVerif && emailVerif.email) {
      const userFromDb = await this.usersService.findOneByEmail(
        emailVerif.email,
      );
      if (userFromDb) {
        await this.usersService.update(userFromDb.id, {
          ...userFromDb,
          verified: true,
        });

        await this.emailVerification.delete({ emailToken: token });
        return !!userFromDb;
      }
    } else {
      throw new HttpException(
        INVALID_TOKEN_EMAIL_MESSAGE,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async sendEmailVerification(email: string) {
    const repository = await this.emailVerification.findOne({
      where: { email: email },
    });

    const user = await this.usersService.findOneByEmail(email);
    const __dirname = path.resolve();
    const filePath = path.join(
      __dirname,
      'src',
      'core',
      'auth',
      'template',
      'template.html',
    );

    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      user: {
        name: user.name,
      },
      verificationLink: `${process.env.BACKEND_BASE_URL}/api/v1/auth/email/verify/${repository.emailToken}`,
    };
    console.log(replacements.verificationLink);

    const htmlToSend = template(replacements);

    if (repository && repository.emailToken) {
      const mailOptions = {
        from: '"Company" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Verify Email',
        text: 'Verify Email',
        html: htmlToSend,
      };

      return await this.sendEmail(mailOptions);
    } else {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.FORBIDDEN);
    }
  }

  async sendEmail(mailOptions) {
    return await new Promise<{}>(async (resolve, reject) => {
      return await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          Logger.log(
            `Error while sending message: ${error}`,
            'sendEmailVerification',
          );
          return reject(error);
        }
        Logger.log(`Send message: ${info.messageId}`, 'sendEmailVerification');
        resolve({ message: SUCCESSFULY_SEND_EMAIL_VERIFICATION_MESSAGE });
      });
    });
  }

  async createForgottenPasswordToken(email: string): Promise<ForgotPassword> {
    let userData = await this.usersService.findOneByEmail(email);
    let forgotPassword = await this.forgotPassword.findOne({ where: { user: userData } });

    if (forgotPassword && ((new Date().getTime() - forgotPassword.timestamp.getTime()) / 60000 < 15)) {
      throw new HttpException('RESET_PASSWORD.EMAIL_SENDED_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      if (!forgotPassword) {
        forgotPassword = new ForgotPassword();
        forgotPassword.user = userData;
      }

      forgotPassword.token = (Math.floor(Math.random() * (9000000)) + 1000000).toString();
      forgotPassword.timestamp = new Date();

      let ret = await this.forgotPassword.save(forgotPassword);

      if (ret) {
        return ret;
      } else {
        throw new HttpException('LOGIN.ERROR.GENERIC_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async sendEmailForgotPassword(email: string): Promise<boolean> {
    let userData = await this.usersService.findOneByEmail(email);
    console.log(userData);
    if (!userData) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    let tokenModel: { token: string } | undefined;
    try {
      tokenModel = await this.createForgottenPasswordToken(email);
      console.log(tokenModel);
    } catch (error) {
      console.error('Error creating token:', error);
    }

    if (tokenModel && tokenModel.token) {
      const __dirname = path.resolve();
      const filePath = path.join(
        __dirname,
        'src',
        'core',
        'auth',
        'template',
        'recoverPassword.html',
      );
      const source = fs.readFileSync(filePath, 'utf-8').toString();
      const template = handlebars.compile(source);
      const replacements = {
        user: {
          name: userData.name,
        },
        resetPasswordLink: `${process.env.BACKEND_BASE_URL}/api/v1/auth/email/reset-password/${tokenModel.token}`,
      };

      const htmlToSend = template(replacements);

      let mailOptions = {
        from: '"Company" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Recupera tu contraseña',
        text: 'Forgot Password',
        html: htmlToSend,
      };

      return !!(await this.sendEmail(mailOptions));
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }

  async checkVerificationCode(token: string) {
    let forgotPassword = await this.forgotPassword.findOne({ relations: ["user"], where: { token: token } });
    if (!forgotPassword) {
      throw new HttpException('Token no encontrado', HttpStatus.NOT_FOUND);
    }
    return forgotPassword.user;
  }



  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    let forgotPassword = await this.forgotPassword.findOne({ relations: ["user"], where: { token: token } });
    if (!forgotPassword) {
      throw new HttpException('Token no encontrado', HttpStatus.NOT_FOUND);
    }

    // Hash the new password before saving it to the database
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update the user's password
    await this.usersService.update(forgotPassword.user.id, {
      ...forgotPassword.user,
      password: hashedPassword,
    });

    // Delete the token from the database
    await this.forgotPassword.delete({ token: token });

    return true;
  }


}