import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService], //demande à Nest de fournir ConfigService à la factory
      //ConfigService est disponible parce que ConfigModule.forRoot({ isGlobal: true }) est dans AppModule (le isGlobal évite de l’importer ici).
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'), //clé secrète pour signer le token
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') ?? '1h' }, //durée de vie du token, par défaut 1h
      }),
    }),
  ],
  
  
})
export class AuthModule {}
