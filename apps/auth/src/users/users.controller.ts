import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';
import { CurrentUser } from '../current-user.decorator';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '@app/common';

@Controller('auth/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: User) {
    return this.usersService.getUser({ email: user.email });
  }
}
