import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/app.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  
  constructor(private prisma: PrismaService) {}
  
  getHello(): string {
    return 'Hello World!';
  }

  async saveTeamMember(teamdto: CreateTeamDto) {
    console.table(teamdto)
    const existingTeam = await this.prisma.teamMember.findMany({
      where: { team: teamdto.team }
    });

    if (existingTeam.length >= teamdto.teamSize) {
      return { message: "Team is full, cannot add more members." };
    }

    const newMember = await this.prisma.teamMember.create({
      data: {
        name: teamdto.name,
        team: teamdto.team,
        teamSize: teamdto.teamSize
      },
    });

    console.log("Adding new member")
    return { message: `${newMember.name} Team member added successfully`, member: newMember };
  }

  async getTeamMembers(team: string) {
    const membersByTeam = await this.prisma.teamMember.findMany({
      where :{
        team
      }
      
    })
    return {team:membersByTeam }
  }

  async getAllTeamMembers() {
    const members = await this.prisma.teamMember.findMany();
  return members;
}
}
