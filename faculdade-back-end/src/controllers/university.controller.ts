/**import { Body, Controller, Get, HttpCode, Post, UseGuards, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreatePerguntaDto } from "src/dto/faculdades/create-ask.dto";
import { CreateUniversityDto } from "src/dto/faculdades/create-university.dto";
import { UniversityService } from "src/service/university.service";
import { AnswerQuestionDto } from "src/dto/faculdades/answer-question.dto";

@Controller('university')
@UseGuards(AuthGuard('jwt'))
export class UniversityController {
    constructor(private readonly universityService:UniversityService){}
    @Post()
    @HttpCode(201)
    async createUniversity(@Body() createUniversity:CreateUniversityDto){
        return this.universityService.createUniversity(createUniversity);
    }

    @Get()
    @HttpCode(200)
    async getAllUniversity(){
        return this.universityService.getAllUniversitys();
    }

    @Post('ask')
    async criarPergunta(@Body() createPerguntaDto: CreatePerguntaDto) {
      return this.universityService.createAskAndOptions(createPerguntaDto);
    }

    @Get('unanswered/:userId')
    @HttpCode(200)
    async getUnansweredQuestions(@Param('userId') userId: string) {
        return this.universityService.getUnansweredQuestions(userId);
    }

    @Post('answer/:userId')
    @HttpCode(201)
    async answerQuestion(
        @Param('userId') userId: string,
        @Body() answerDto: AnswerQuestionDto
    ) {
        return this.universityService.answerQuestion(userId, answerDto);
    }

    @Get('question/:id')
    @HttpCode(200)
    async getQuestionById(@Param('id') id: string) {
        return this.universityService.getQuestionById(id);
    }
}**/