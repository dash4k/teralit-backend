import { Resend } from 'resend';
import emailContent from '../contents/verification-email-content.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token) => {
  const { error } = await resend.emails.send(emailContent(email, token));

  if (error) {
    console.error('Resend error: ', error);
    throw new Error(error.message);
  }
};

export default sendVerificationEmail;
