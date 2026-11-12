// src/auth/guards/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) // pour récupérer les métadonnées des décorateurs
  {}

  canActivate(context: ExecutionContext): boolean //context : contexte de la requête HTTP (route, contrôleur, etc.)
  {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]); // récupère les rôles requis pour la route (ou le contrôleur) à partir des métadonnées du décorateur @Roles

    // pas de @Roles sur la route : accès libre (déjà filtré par le JwtAuthGuard)
    if (!requiredRoles || requiredRoles.length === 0) return true; // pas de rôle requis, donc accès autorisé

    const { user } = context.switchToHttp().getRequest();
    return !!user && requiredRoles.includes(user.role); //user existe et son rôle est dans la liste des rôles requis
  }
}