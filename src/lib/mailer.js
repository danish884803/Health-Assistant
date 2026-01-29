import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   EMAIL OTP
========================= */
export async function sendEmailOtp(email, otp) {
  await transporter.sendMail({
    from: `"Hospital Help" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email – Hospital Help",
    html: `
      <div style="font-family: Arial, sans-serif">
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 4px">${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `,
  });
}

/* =========================
   APPOINTMENT BOOKED
========================= */
export async function sendAppointmentEmail({
  to,
  doctorName,
  date,
  time,
  clinic,
  room,
}) {
  await transporter.sendMail({
    from: `"Sheikh Khalifa Hospital" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Appointment Confirmed",
    html: `
      <h2>Appointment Confirmed</h2>
      <p><b>Doctor:</b> ${doctorName}</p>
      <p><b>Date:</b> ${new Date(date).toDateString()}</p>
      <p><b>Time:</b> ${time}</p>
      <p><b>Clinic:</b> ${clinic}</p>
      <p><b>Room:</b> ${room}</p>
      <p>Thank you for choosing Sheikh Khalifa Hospital.</p>
    `,
  });
}

/* =========================
   APPOINTMENT RESCHEDULED
========================= */
export async function sendAppointmentRescheduledEmail({
  to,
  doctorName,
  date,
  time,
  clinic,
  room,
}) {
  await transporter.sendMail({
    from: `"Sheikh Khalifa Hospital" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Appointment Rescheduled",
    html: `
      <h2>Appointment Rescheduled</h2>
      <p>Your appointment has been rescheduled.</p>
      <p><b>Doctor:</b> ${doctorName}</p>
      <p><b>New Date:</b> ${new Date(date).toDateString()}</p>
      <p><b>New Time:</b> ${time}</p>
      <p><b>Clinic:</b> ${clinic}</p>
      <p><b>Room:</b> ${room}</p>
    `,
  });
}

/* =========================
   APPOINTMENT CANCELLED
========================= */
export async function sendAppointmentCancelledEmail({
  to,
  doctorName,
  date,
  time,
}) {
  await transporter.sendMail({
    from: `"Sheikh Khalifa Hospital" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Appointment Cancelled",
    html: `
      <h2>Appointment Cancelled</h2>
      <p>Your appointment has been cancelled.</p>
      <p><b>Doctor:</b> ${doctorName}</p>
      <p><b>Date:</b> ${new Date(date).toDateString()}</p>
      <p><b>Time:</b> ${time}</p>
      <p>If this was a mistake, please book again.</p>
    `,
  });
}
export async function sendDoctorSummaryEmail({
  to,
  patientName,
  summary,
}) {
  await transporter.sendMail({
    from: `"SK Hospital" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Medical Summary",
    html: `
      <h2>Medical Summary</h2>
      <p><b>Patient:</b> ${patientName}</p>
      <p>${summary}</p>
      <p>— Sheikh Khalifa Hospital</p>
    `,
  });
}


// export async function sendMedicalSummaryEmail({
//   to,
//   patientName,
//   pdfBuffer,
// }) {
//   await transporter.sendMail({
//     from: `"Sheikh Khalifa Hospital" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "Your Medical Summary",
//     html: `
//       <p>Dear ${patientName},</p>
//       <p>Your medical summary is attached as a PDF.</p>
//       <p>Regards,<br/>Sheikh Khalifa Hospital</p>
//     `,
//     attachments: [
//       {
//         filename: "medical-summary.pdf",
//         content: pdfBuffer,
//       },
//     ],
//   });
// }
export async function sendMedicalSummaryEmail({
  to,
  patientName,
  pdfBuffer,
}) {
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
    throw new Error("Invalid PDF buffer");
  }

  await transporter.sendMail({
    from: `"Sheikh Khalifa Hospital" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Medical Summary (PDF)",
    html: `
      <p>Dear ${patientName},</p>
      <p>Your medical summary is attached as a PDF.</p>
      <p>Please keep this document for your records.</p>
      <br/>
      <p>Regards,<br/>Sheikh Khalifa Hospital</p>
    `,
    attachments: [
      {
        filename: "medical-summary.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
        encoding: "base64",
        disposition: "attachment",
      },
    ],
  });
}
