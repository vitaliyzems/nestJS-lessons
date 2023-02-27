import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { News } from 'src/news/entities/news.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendTest() {
    console.log('Отправляется письмо установки');
    return this.mailerService
      .sendMail({
        to: 'zemc96@icloud.com',
        subject: 'Первое тестовое письмо',
        template: './test'
      })
      .then(res => console.log('res', res))
      .catch(err => console.log('err', err));
  }

  async sendNewNewsForAdmins(emails: string[], news: News): Promise<void> {
    for (const email of emails) {
      this.mailerService
        .sendMail({
          to: email,
          subject: `Создана новая новость: ${news.title}`,
          template: './new-news',
          context: {
            title: news.title,
            description: news.description,
            author: news.user.firstName,
            id: news.id
          }
        })
        .then(res => console.log('res', res))
        .catch(err => {
          throw new Error(err);
        });
    }
  }
}
