import {
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  IsUrl,
  IsEnum,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
    message: 'Please provide a valid phone number',
  })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(['en', 'am'], {
    message: 'Language must be either "en" or "am"',
  })
  @IsOptional()
  language?: string;

  @IsUrl({}, { message: 'Please provide a valid URL' })
  @IsOptional()
  profileImage?: string;

  @IsOptional()
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

