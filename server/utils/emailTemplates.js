export function generateVerificationOtpEmailTemplate(otpCode) {
  return `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:14px;
      overflow:hidden;
      box-shadow:0 8px 24px rgba(0,0,0,0.08);
    ">

      <!-- HEADER -->
      <div style="background:#000000;padding:28px;text-align:center;">
        <div style="font-size:42px;line-height:1;">📚</div>
        <h1 style="
          margin:8px 0 0;
          font-size:22px;
          color:#ffffff;
          letter-spacing:0.6px;
        ">
          BookWorm Library
        </h1>
        <p style="margin:6px 0 0;color:#ffffffaa;font-size:14px;">
          Email Verification
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:30px;font-size:15px;color:#333333;line-height:1.6;">
        <p>Hello Reader,</p>

        <p>
          We received a request to verify your email address for your
          <strong>BookWorm Library</strong> account.
        </p>

        <p>Please use the verification code below:</p>

        <!-- OTP BOX -->
        <div style="
          text-align:center;
          margin:30px 0;
          padding:18px;
          font-size:28px;
          font-weight:bold;
          letter-spacing:6px;
          background:#f0f7ff;
          border:2px dashed #0077cc;
          border-radius:10px;
          color:#0077cc;
        ">
          ${otpCode}
        </div>

        <p>
          ⏳ This code will expire in <strong>10 minutes</strong>.
          Please do not share it with anyone.
        </p>

        <p>
          If you did not request this verification, you can safely ignore this email.
        </p>

        <p style="margin-top:30px;">
          Happy Reading,<br/>
          <strong>BookWorm Library Team</strong>
        </p>
      </div>

      <!-- FOOTER -->
      <div style="
        background:#fafafa;
        padding:16px;
        text-align:center;
        font-size:12px;
        color:#777777;
      ">
        © 2025 BookWorm Library. All Rights Reserved.
      </div>

    </div>
  </div>
  `;
}





export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:14px;
      overflow:hidden;
      box-shadow:0 8px 24px rgba(0,0,0,0.08);
    ">

      <!-- HEADER -->
      <div style="background:#000000;padding:28px;text-align:center;">
        <div style="font-size:42px;line-height:1;">🔒</div>
        <h1 style="
          margin:8px 0 0;
          font-size:22px;
          color:#ffffff;
          letter-spacing:0.6px;
        ">
          BookWorm Library
        </h1>
        <p style="margin:6px 0 0;color:#ffffffaa;font-size:14px;">
          Password Reset
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:30px;color:#333333;font-size:15px;line-height:1.6;">
        <p>Hello Reader,</p>

        <p>
          We received a request to reset the password for your
          <strong>BookWorm Library</strong> account.
        </p>

        <p style="margin:20px 0;">
          Click the button below to reset your password:
        </p>

        <!-- BUTTON -->
        <div style="text-align:center;margin:30px 0;">
          <a
            href="${resetPasswordUrl}"
            target="_blank"
            style="
              display:inline-block;
              padding:14px 32px;
              background:#0077cc;
              color:#ffffff;
              text-decoration:none;
              border-radius:8px;
              font-size:16px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="font-size:14px;">
          If the button does not work, copy and paste the link below into your browser:
        </p>

        <p style="word-break:break-all;color:#0077cc;font-size:14px;">
          ${resetPasswordUrl}
        </p>

        <p>
          ⏳ This link will expire in <strong>10 minutes</strong>.
          Please do not share it with anyone.
        </p>

        <p>
          If you did not request this, you can safely ignore this email.
        </p>

        <p style="margin-top:30px;">
          Stay Secure,<br/>
          <strong>BookWorm Library Team</strong>
        </p>
      </div>

      <!-- FOOTER -->
      <div style="
        background:#fafafa;
        padding:18px;
        text-align:center;
        font-size:12px;
        color:#777777;
      ">
        © 2025 BookWorm Library. All rights reserved.
      </div>

    </div>
  </div>
  `;
}



