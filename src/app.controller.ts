import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTeamDto } from './dto/app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post("/save")
  saveTeamMember(@Body() teamdto:CreateTeamDto){
    return this.appService.saveTeamMember(teamdto);
  }
  @Get("/team")
  getTeamMembers(){
    return this.appService.getAllTeamMembers();
  }
}
