import { jsPDF } from "jspdf";

export type Informe = {
  dia: string;
  mes: string;
  anio: string;
  nombres: string;
  documento: string;
  edad: string;
  sexo: string;
  nacimiento: string;
  hermanos: string;
  escolarizacion: string;
  estadoCivil: string;
  motivo: string;
  examenMental: string;
  dinamicaFamiliar: string;
  areaEscolar: string;
  antecedentes: string;
  recomendaciones: string;
  profesional: string;
  tarjeta: string;
};

const M = 18;
const W = 210;
const CW = W - M * 2;

export function generarPdf(d: Informe) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = M;

  const ensure = (h: number) => {
    if (y + h > 297 - 22) {
      footer(doc);
      doc.addPage();
      y = M;
    }
  };

  const header = () => {
    doc.setDrawColor(30, 80, 78);
    doc.setLineWidth(0.4);
    doc.rect(M, y, CW, 18);
    doc.line(M + 26, y, M + 26, y + 18);
    doc.setFillColor(30, 80, 78);
    doc.circle(M + 13, y + 9, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("MM", M + 13, y + 10.5, { align: "center" });
    doc.setTextColor(20, 30, 30);
    doc.setFontSize(15);
    doc.text("ATENCIÓN PSICOLÓGICA", M + 26 + (CW - 26) / 2, y + 11, {
      align: "center",
    });
    y += 24;
  };

  const label = (t: string) => {
    ensure(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 80, 78);
    doc.text(t.toUpperCase(), M, y);
    y += 2;
    doc.setDrawColor(200, 214, 210);
    doc.setLineWidth(0.3);
    doc.line(M, y, M + CW, y);
    y += 4;
  };

  const block = (title: string, text: string) => {
    label(title);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(25, 30, 30);
    const lines = doc.splitTextToSize(text || "—", CW - 8) as string[];
    const h = lines.length * 5.2 + 7;
    ensure(h);
    doc.setDrawColor(215, 226, 222);
    doc.setFillColor(250, 252, 251);
    doc.rect(M, y - 1, CW, h, "FD");
    doc.text(lines, M + 4, y + 4.6);
    y += h + 6;
  };

  const footer = (dd: jsPDF) => {
    dd.setFont("helvetica", "italic");
    dd.setFontSize(7.5);
    dd.setTextColor(120, 130, 128);
    dd.text(
      "“Este documento es de carácter confidencial y no podrá ser utilizado para otros fines distintos para los que ha sido realizado, ni divulgarse”",
      W / 2,
      285,
      { align: "center", maxWidth: CW },
    );
  };

  header();

  // fecha
  const bw = 22;
  const bx = M + CW - bw * 3;
  doc.setDrawColor(30, 80, 78);
  doc.setLineWidth(0.3);
  ["Día", "Mes", "Año"].forEach((t, i) => {
    doc.rect(bx + i * bw, y, bw, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 80, 78);
    doc.text(t, bx + i * bw + bw / 2, y + 4.8, { align: "center" });
  });
  [d.dia, d.mes, d.anio].forEach((t, i) => {
    doc.rect(bx + i * bw, y + 7, bw, 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(25, 30, 30);
    doc.text(t || "", bx + i * bw + bw / 2, y + 11.8, { align: "center" });
  });
  y += 20;

  label("I. Datos generales");
  const datos: [string, string][] = [
    ["Nombres y apellidos", d.nombres],
    ["Documento de identidad", d.documento],
    ["Edad", d.edad],
    ["Sexo", d.sexo],
    ["Fecha de nacimiento", d.nacimiento],
    ["Número de hermanos", d.hermanos],
    ["Escolarización", d.escolarizacion],
    ["Estado civil", d.estadoCivil],
  ];
  datos.forEach(([k, v]) => {
    ensure(7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(95, 105, 103);
    doc.text(`${k}`, M + 2, y);
    doc.setTextColor(20, 25, 25);
    doc.setFont("helvetica", "bold");
    doc.text(v || "—", M + 68, y);
    y += 6.4;
  });
  y += 4;

  block("Motivo de consulta", d.motivo);
  block("Examen mental aparente", d.examenMental);
  block("Dinámica familiar", d.dinamicaFamiliar);
  block("Área escolar", d.areaEscolar);
  block("Antecedentes relevantes", d.antecedentes);
  block("Recomendaciones", d.recomendaciones);

  ensure(40);
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 80, 78);
  doc.text("FIRMA Y REGISTRO PROFESIONAL:", M, y);
  y += 22;
  doc.setDrawColor(60, 70, 70);
  doc.line(W / 2 - 35, y, W / 2 + 35, y);
  y += 6;
  doc.setTextColor(20, 25, 25);
  doc.setFontSize(10.5);
  doc.text(d.profesional.toUpperCase(), W / 2, y, { align: "center" });
  y += 5.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text(`T.P ${d.tarjeta}`, W / 2, y, { align: "center" });

  footer(doc);

  const nombre = (d.nombres || "informe").trim().replace(/\s+/g, "_");
  doc.save(`Informe_Psicologico_${nombre}.pdf`);
}
