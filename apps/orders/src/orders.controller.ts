import { JwtAuthGuard, ResponseHelper } from '@app/common';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'apps/auth/src/current-user.decorator';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() request: CreateOrderRequest) {
    return this.ordersService.createOrder(request);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders() {
    return ResponseHelper.success(await this.ordersService.getOrders());
  }
}
