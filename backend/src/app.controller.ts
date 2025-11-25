import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Azemera Academy API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
      },
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

