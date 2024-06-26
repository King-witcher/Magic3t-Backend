import { Controller, Get, ImATeapotException } from '@nestjs/common'

const Package = require('../package.json')

@Controller()
export class AppController {
  @Get('teapot')
  teapot(): never {
    throw new ImATeapotException()
  }

  @Get('status')
  status() {
    const rand = Math.random()
    if (rand < 0.0001) throw new ImATeapotException()
    return {
      status: 'available',
    }
  }

  @Get('version')
  getVersion() {
    return Package.version
  }
}
