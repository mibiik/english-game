import emailjs from '@emailjs/browser';
import { EMAILJS_PUBLIC_KEY } from '../config/apiKeys';

export async function sendMail({
  serviceId,
  templateId,
  to_email,
  subject,
  message,
  reply_to
}: {
  serviceId: string;
  templateId: string;
  to_email: string;
  subject: string;
  message: string;
  reply_to?: string;
}) {
  const templateParams = {
    to_email,
    subject,
    message,
    reply_to: reply_to || ''
  };
  return emailjs.send(serviceId, templateId, templateParams, EMAILJS_PUBLIC_KEY);
} 