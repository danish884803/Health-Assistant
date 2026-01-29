import PDFDocument from "pdfkit";
import path from "path";

export function generateMedicalSummaryPDF(appointment) {
  return new Promise((resolve, reject) => {
    try {
      const fontPath = path.join(
        process.cwd(),
        "public/fonts/Roboto-Regular.ttf"
      );

      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        font: fontPath,
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const s = appointment.medicalSummary;

      doc.fontSize(18).text("Medical Summary", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Patient: ${appointment.patientName}`);
      doc.text(`Patient ID: ${appointment.patientId}`);
      doc.text(`Doctor: ${appointment.doctorName}`);
      doc.text(`Department: ${appointment.department}`);
      doc.text(`Clinic: ${appointment.clinic}`);
      doc.text(`Room: ${appointment.room}`);
      doc.text(`Date: ${new Date(appointment.date).toLocaleDateString()}`);
      doc.text(`Time: ${appointment.time}`);
      doc.moveDown();

      doc.fontSize(14).text("Diagnosis");
      doc.fontSize(12).text(s.diagnosis || "-");
      doc.moveDown();

      doc.fontSize(14).text("Notes");
      doc.fontSize(12).text(s.notes || "-");
      doc.moveDown();

      if (s.prescription) {
        doc.fontSize(14).text("Prescription");
        doc.fontSize(12).text(s.prescription);
        doc.moveDown();
      }

      if (s.followUpDate) {
        doc.text(
          `Follow-up Date: ${new Date(
            s.followUpDate
          ).toLocaleDateString()}`
        );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
