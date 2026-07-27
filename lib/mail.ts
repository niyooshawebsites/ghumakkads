import "server-only";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function mailOptions(email: string, verifyUrl: string) {
  return {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Verify your Email",
    html: `
    <div>
       <h2>Verify your account</h2>
       <p>Click on the link to verify your email: </p>
       <a href=${verifyUrl}>Verify Email</a>
    </div>
    `,
  };
}

export async function sendVerificationEmail(email: string, verifyUrl: string) {
  try {
    await transporter.sendMail(mailOptions(email, verifyUrl));
  } catch (err) {
    console.log(
      err instanceof Error
        ? err.message
        : "Issue in sending verification email",
    );
  }
}
