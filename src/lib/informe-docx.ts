import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  ShadingType,
} from "docx";
import {
  CONFIDENCIALIDAD,
  PROFESIONAL,
  TARJETA,
  bloques,
  datosGenerales,
  descargar,
  logoBytes,
  nombreArchivo,
  type Informe,
} from "./informe";

const TEAL = "1E504E";
const CONTENT = 9026; // A4 con márgenes de 1"

const borde = { style: BorderStyle.SINGLE, size: 4, color: "C8D6D2" };
const bordes = { top: borde, bottom: borde, left: borde, right: borde };

const celda = (children: Paragraph[], width: number, fill?: string) =>
  new TableCell({
    borders: bordes,
    width: { size: width, type: WidthType.DXA },
    ...(fill ? { shading: { fill, type: ShadingType.CLEAR } } : {}),
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children,
  });

const p = (text: string, opts: { bold?: boolean; size?: number; color?: string } = {}) =>
  new Paragraph({
    children: [
      new TextRun({
        text,
        bold: opts.bold ?? false,
        size: opts.size ?? 22,
        color: opts.color ?? "1A1F1F",
      }),
    ],
  });

export async function generarDocx(d: Informe) {
  const logo = await logoBytes();

  const titulo = (t: string) =>
    new Paragraph({
      spacing: { before: 280, after: 100 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "C8D6D2", space: 2 } },
      children: [new TextRun({ text: t.toUpperCase(), bold: true, size: 20, color: TEAL })],
    });

  const bloque = (t: string, v: string) => [
    titulo(t),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [CONTENT],
      rows: [
        new TableRow({
          children: [
            celda(
              (v || "—").split("\n").map((line) => p(line)),
              CONTENT,
              "FAFCFB",
            ),
          ],
        }),
      ],
    }),
  ];

  const filasDatos = datosGenerales(d).map(
    ([k, v]) =>
      new TableRow({
        children: [
          celda([p(k, { color: "5F6967" })], 3200),
          celda([p(v || "—", { bold: true })], CONTENT - 3200),
        ],
      }),
  );

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: CONFIDENCIALIDAD,
                    italics: true,
                    size: 15,
                    color: "78827F",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Table({
            width: { size: CONTENT, type: WidthType.DXA },
            columnWidths: [1800, CONTENT - 1800],
            rows: [
              new TableRow({
                children: [
                  celda(
                    [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new ImageRun({
                            type: "png",
                            data: logo,
                            transformation: { width: 64, height: 64 },
                            altText: {
                              title: "Logo",
                              description: "Marca personal Martha Cecilia Morales",
                              name: "logo",
                            },
                          }),
                        ],
                      }),
                    ],
                    1800,
                  ),
                  celda(
                    [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 200 },
                        children: [
                          new TextRun({
                            text: "ATENCIÓN PSICOLÓGICA",
                            bold: true,
                            size: 30,
                            color: "141E1E",
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `${PROFESIONAL} · T.P ${TARJETA}`,
                            size: 18,
                            color: "5A6E6C",
                          }),
                        ],
                      }),
                    ],
                    CONTENT - 1800,
                  ),
                ],
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: `Fecha: ${d.dia}/${d.mes}/${d.anio}`,
                bold: true,
                size: 20,
                color: TEAL,
              }),
            ],
          }),
          titulo("I. Datos generales"),
          new Table({
            width: { size: CONTENT, type: WidthType.DXA },
            columnWidths: [3200, CONTENT - 3200],
            rows: filasDatos,
          }),
          ...bloques(d).flatMap(([t, v]) => bloque(t, v)),
          new Paragraph({
            spacing: { before: 600 },
            children: [
              new TextRun({
                text: "FIRMA Y REGISTRO PROFESIONAL:",
                bold: true,
                size: 20,
                color: TEAL,
              }),
            ],
          }),
          new Paragraph({ spacing: { before: 700 }, children: [new TextRun("")] }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: "3C4646", space: 2 } },
            children: [new TextRun({ text: "" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: PROFESIONAL.toUpperCase(), bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `T.P ${TARJETA}`, size: 20 })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  descargar(blob, nombreArchivo(d, "docx"));
}
