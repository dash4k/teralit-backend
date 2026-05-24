const emailBody = (verifyUrl) => `
  <div style="background-color:#faf8ff;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:40px 20px;box-sizing:border-box;">
    <div style="text-align:center;width:100%;">
      
      <!-- Logo -->
      <div style="margin-bottom:40px;">
        <div style="display:inline-flex;align-items:center;justify-content:center;height:auto;background-color:#0052CC;border-radius:14px;border:1px solid #737685;padding:0px 15px;">
          <span style="color:#ffffff;font-size:22px;font-weight:700;">T</span>
        </div>
      </div>

      <!-- Title -->
      <h1 style="color:#191b23;font-size:40px;font-weight:600;margin:0 0 20px 0;letter-spacing:-0.5px;">
        Confirm your account
      </h1>

      <!-- Subtitle -->
      <p style="color:#888888;font-size:15px;line-height:1.6;margin:0 0 40px 0;display:block;margin-left:auto;margin-right:auto;">
        Thank you for signing up for Teralit. To confirm your account, please click the button below.
      </p>

      <!-- Button -->
      <a href="${verifyUrl}" style="display:inline-block;background-color:#0052cc;color:#ffffff;text-decoration:none;font-size:15px;font-weight:500;padding:16px 48px;border-radius:100px;margin-bottom:60px;">
        Confirm account
      </a>

      <!-- Footer -->
      <div style="margin-top:60px;">
        <p style="color:#444444;font-size:13px;margin:0;line-height:1.8;">Coding Camp 2026</p>
        <p style="color:#444444;font-size:13px;margin:0;line-height:1.8;">Indonesia</p>
      </div>

    </div>
  </div>
`;

export default emailBody;
