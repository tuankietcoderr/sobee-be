import { HttpStatus } from '@nestjs/common';

export class ResponseHelper {
  public static success(
    data: any,
    message: string = 'Success',
    statusCode: number = HttpStatus.OK,
  ) {
    return {
      statusCode,
      message,
      data,
    };
  }

  public static error(
    message: string = 'Error',
    statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    return {
      statusCode,
      message,
    };
  }
}
