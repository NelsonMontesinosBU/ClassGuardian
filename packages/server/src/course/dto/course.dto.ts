import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

@InputType()
export class AddCourseDto {
  @IsDefined()
  @IsString()
  @Field()
  userId: string;

  @IsDefined()
  @IsString()
  @Field()
  name: string;

  @IsOptional()
  @IsString()
  @Field()
  description: string;

  @IsString()
  @Field()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  semesterId: number;

  @IsDateString()
  @Field()
  startDate: Date;

  @IsDateString()
  @Field()
  endDate: Date;
}

@InputType()
export class UpdateCourseDto {
  @IsDefined()
  @IsString()
  @Field()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsOptional()
  @IsString()
  @Field()
  description: string;

  @IsString()
  @Field()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  semesterId: number;

  @IsDateString()
  @Field()
  startDate: Date;

  @IsDateString()
  @Field()
  endDate: Date;
}

@InputType()
export class DeleteCourseDto {
  @IsDefined()
  @IsString()
  @Field()
  userId: string;

  @IsDefined()
  @IsString()
  @Field()
  courseId: string;
}

@InputType()
export class GetCourseByNameDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;
}

@InputType()
export class CheckInDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  joinCode: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  studentId: string;
}
