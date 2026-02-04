export const runtime = "nodejs"; // 🔥 CRITICAL

import PDFDocument from "pdfkit/js/pdfkit.standalone";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const fontPath = path.join(
      process.cwd(),
      "src/assets/fonts/Roboto-Regular.ttf"
    );

    const doc = new PDFDocument();
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("error", (e) => {
      throw e;
    });

    doc.registerFont("Roboto", fs.readFileSync(fontPath));
    doc.font("Roboto");

    doc.fontSize(22).text("PDF SYSTEM CHECK", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text("PDFKit standalone + Node runtime works.");
    doc.text("No Helvetica. Gmail safe. Browser safe.");

    doc.end();

    const pdfBuffer = await new Promise((resolve) =>
      doc.on("end", () => resolve(Buffer.concat(chunks)))
    );

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=test.pdf",
      },
    });
  } catch (err) {
    console.error("TEST PDF ERROR:", err);
    return new Response("PDF failed", { status: 500 });
  }
}
