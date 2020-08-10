import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { MailService } from '../services/mail.service';
import { EFeatureList } from '../services/feature.enum';

@ApiUseTags('Mail')
@Controller('mail')
// @UseGuards(RolesGuard)
@ApiBearerAuth()
export class MailController {
  constructor(public service: MailService) {}

  @Post('test')
  async send(): Promise<any> {
    const data = {
      user: {
        name: 'Aditia Prasetio',
      },
    };
    return this.service.send('aditia.prasetio@mavila.co.id', 'Forgot Password', data, EFeatureList.FORGOT_PASSWORD);
  }
}
