import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../constants/error-messages';

export interface AuthRequest extends Request {
  userId?: number; // Ajout d'une propriété userId pour stocker l'ID de l'utilisateur authentifié
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers['auth-user']; // Récupère le token depuis l'en-tête "auth-user"

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET ?? 'monsecret',
      ) as jwt.JwtPayload; // Vérifie et décode le token JWT

      if (!payload.userId) {
        return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
        //401 Unauthorized si le token ne contient pas d'ID utilisateur
      }

      req.userId = payload.userId; // injecté dans la requête
      next(); // Passe au middleware suivant ou au gestionnaire de route
    } catch {
      return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }
  }
}