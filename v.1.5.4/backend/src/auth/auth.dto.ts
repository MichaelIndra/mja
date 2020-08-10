import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;
}

export class UpdatePasswordDto {
  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  re_password: string;
}

export class ResetPasswordDto extends UpdatePasswordDto {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  token: string;
}

export class RandomResetPasswordDto {
  @ApiModelProperty()
  email: string;
}

export class LinkResetPasswordDto {
  @ApiModelProperty()
  email: string;

  @ApiModelPropertyOptional({ description: 'Set redirect_url if user can reset password by link.'})
  redirect_url?: string;
}

export class SendLinkResetPasswordDto {
  @ApiModelProperty()
  email: string;

  @ApiModelPropertyOptional({ description: 'Set this value if you want to randomize password.'})
  randomize?: number;

  @ApiModelPropertyOptional({ description: 'Set redirect_url if user can reset password by link.'})
  redirect_url?: string;
}
