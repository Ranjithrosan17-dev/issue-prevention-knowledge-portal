import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsObject } from 'class-validator';
import { ContentType } from '../../../common/enums/content-type.enum';

export class CreateContentDto {
  @ApiProperty({ enum: ContentType })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  affectedTeam?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  issueDetail?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  processDetail?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  blogDetail?: Record<string, any>;
}
