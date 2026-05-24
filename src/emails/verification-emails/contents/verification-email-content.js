import emailBody from '../bodies/verification-email-body.js';

const emailContent = (email, token) => {
  const verifyUrl = `${process.env.APP_URL}/authentications/verify-email?token=${token}`;

  return {
    from: 'Teralit <noreply@api.teralit.skin>',
    to: email,
    subject: 'Confirm your Teralit account',
    html: emailBody(verifyUrl),
  };
};

export default emailContent;
