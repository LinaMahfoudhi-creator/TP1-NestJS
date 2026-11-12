// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),// extrait le token de l’en-tête Authorization
      ignoreExpiration: false, // vérifie la date d’expiration du token
      secretOrKey: config.get<string>('JWT_SECRET')!, // clé secrète pour vérifier la signature du token
    });
  }

  // appelée si le token est valide (signature + expiration)
  validate(payload: { sub: number; username: string; role: string }) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
    // retourne les informations de l’utilisateur à la requête (req.user)
  }
}