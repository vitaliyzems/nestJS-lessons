import { IsString, ValidateIf } from 'class-validator';

export class UpdateNewsDto {
  @ValidateIf(o => o.title)
  @IsString()
  public title?: string;

  @ValidateIf(o => o.description)
  @IsString()
  public description?: string;

  @ValidateIf(o => o.author)
  @IsString()
  public author?: string;
}