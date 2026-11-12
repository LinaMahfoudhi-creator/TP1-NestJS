// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userService.findByUsernameOrEmail(dto.username, dto.email); //garantir l'unicité
    if (exists) throw new ConflictException('Username ou email déjà utilisé');

    const hash = await bcrypt.hash(dto.password, 10);  //hash est une transformation à sens unique
    //bcrypt génère automatiquement un sel aléatoire et l’inclut dans le hash : deux utilisateurs avec le même mot de passe ont des hashs différents.
    const user = await this.userService.create({ ...dto, password: hash }); //remplacer le mot de passe par son hash 

    const { password, ...result } = user;   // ne jamais renvoyer le hash
    return result; //user sans le mot de passe
  }

  async login(dto: LoginDto) {
  const user = await this.userService.findByUsername(dto.username);
  const valid = user && (await bcrypt.compare(dto.password, user.password));
  if (!valid) throw new UnauthorizedException('Identifiants invalides');

  const payload = { sub: user.id, username: user.username, role: user.role };
  //payload contient les informations de l’utilisateur à inclure dans le token
  return { access_token: await this.jwtService.signAsync(payload) }; 
  //on signe le payload avec la clé secrète pour générer le token JWT
  //Le nom access_token est la convention. Le client renverra ce token dans Authorization: Bearer <token>.
}
}