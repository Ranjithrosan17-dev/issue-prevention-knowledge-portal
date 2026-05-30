import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const smtp = configService.get('app.smtp');
    if (smtp?.host) {
      this.transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        auth: { user: smtp.user, pass: smtp.pass },
      });
    }
  }

  async sendReviewRequest(toEmail: string, contentTitle: string, contentId: string) {
    await this.send(toEmail, `Review Requested: ${contentTitle}`,
      `<p>A new content item <strong>${contentTitle}</strong> has been submitted for your review.</p><p>Content ID: ${contentId}</p>`);
  }

  async sendApprovalNotification(toEmail: string, contentTitle: string) {
    await this.send(toEmail, `Approved: ${contentTitle}`,
      `<p>Your content <strong>${contentTitle}</strong> has been approved and is ready to publish.</p>`);
  }

  async sendStaleContentAlert(toEmail: string, contentTitle: string, contentId: string) {
    await this.send(toEmail, `Stale Content Alert: ${contentTitle}`,
      `<p>The content item <strong>${contentTitle}</strong> (ID: ${contentId}) is overdue for review.</p>`);
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.warn(`[NOTIFICATION] Email not configured. To: ${to} | Subject: ${subject}`);
      return;
    }
    try {
      await this.transporter.sendMail({
        from: this.configService.get('app.smtp.from'),
        to, subject, html,
      });
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
    }
  }
}
