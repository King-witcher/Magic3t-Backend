import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class CreateAccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  username: string

  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(6)
  password: string

  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  nickname: string
}
