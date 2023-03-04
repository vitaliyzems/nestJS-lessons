import { Controller, Get, Post, Body, Patch, Param, Delete, Render, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { compare, hash } from 'src/utils/crypto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = new User();
    user.firstName = dto.firstName;
    user.email = dto.email;
    user.password = await hash(dto.password);
    user.role = dto.role;
    return await this.userService.create(user);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('views/update/:id')
  @Render('user-update')
  async getUpdateView(@Param('id') id: string) {
    const _user = await this.findOne(id);
    return { user: _user };
  }

  @Get('email')
  async findByEmail(@Body() dto: { email: string; }) {
    return await this.userService.findByEmail(dto.email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const _user = await this.userService.findOne(Number(id));
    if ((dto.password && !await compare(dto.password, _user.password)) || (!dto.password && dto.newPassword)) {
      throw new HttpException(
        'Неверный пароль',
        HttpStatus.UNAUTHORIZED
      );
    }
    if (await compare(dto.password, _user.password) && !dto.newPassword) {
      throw new HttpException(
        'Новый пароль не должен быть пустым',
        HttpStatus.BAD_REQUEST
      );
    }
    if (dto.firstName) {
      _user.firstName = dto.firstName;
    }
    if ((await compare(dto.password, _user.password)) && dto.newPassword !== null) {
      _user.password = await hash(dto.newPassword);
    }
    return this.userService.update(_user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
