import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { UserDTO } from './dto/user.dto'
import { AuthGuard } from './security/auth.guard'
import { RolesGuard } from './role.guard'
import { RoleType } from './role-type'
import { Roles } from './repository/role.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Req() req: Request, @Body() userDTO: UserDTO) {
    return await this.authService.registerUser(userDTO)
  }

  @Post('/sign-in')
  async signin(@Body() userDTO: UserDTO, @Res() res: Response) {
    const user = await this.authService.validateUser(userDTO)
    const access_token = await this.authService.generateAccessToken(user)
    res.setHeader('Authorization', 'Bearer ' + access_token)
    return res.json({ access_token })
  }

  @Get('/admin-role')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  adminRoleCheck(@Req() req: Request): any {
    const user: any = req.user
    return user
  }

  // 가드(AuthGuard) 추가해주기
  @Get('/authenticate')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: Request) {
    const user = req.user
    return user
  }
}
