export function generateVerificationOtpEmailTemplate(otpCode){
    return `
    <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.1);padding:30px;font-family:Arial,sans-serif;">
  <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:15px;">
    <h1 style="margin:0;font-size:24px;color:#0077cc;">📚 Bookworm Verification</h1>
  </div>
  <div style="margin:25px 0;font-size:16px;color:#333333;">
    <p>Hello Reader,</p>
    <p>We received a request to verify your email for your <b>Bookworm Library</b> account.</p>
    <p>Please use the OTP code below to complete the process:</p>
    <div style="text-align:center;background:#f0f7ff;border:1px dashed #000;border-radius:8px;font-size:28px;font-weight:bold;color:#0077cc;padding:20px;letter-spacing:5px;margin:20px 0;">
      ${otpCode}
    </div>
    <p>This code will expire in <b>10 minutes</b>. Do not share it with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>
  </div>
  <div style="text-align:center;font-size:13px;color:#888888;margin-top:30px;">
    © 2025 Bookworm Library. All Rights Reserved.
  </div>
</div>

    
    `
}