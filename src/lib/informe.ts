import logoUrl from "@/assets/logo-mcm.png";

export const PROFESIONAL = "Martha Cecilia Morales";
export const TARJETA = "173792";

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
};

export const CONFIDENCIALIDAD =
  "“Este documento es de carácter confidencial y no podrá ser utilizado para otros fines distintos para los que ha sido realizado, ni divulgarse”";

export const datosGenerales = (d: Informe): [string, string][] => [
  ["Nombres y apellidos", d.nombres],
  ["Documento de identidad", d.documento],
  ["Edad", d.edad],
  ["Sexo", d.sexo],
  ["Fecha de nacimiento", d.nacimiento],
  ["Número de hermanos", d.hermanos],
  ["Escolarización", d.escolarizacion],
  ["Estado civil", d.estadoCivil],
];

export const bloques = (d: Informe): [string, string][] => [
  ["Motivo de consulta", d.motivo],
  ["Examen mental aparente", d.examenMental],
  ["Dinámica familiar", d.dinamicaFamiliar],
  ["Área escolar", d.areaEscolar],
  ["Antecedentes relevantes", d.antecedentes],
  ["Recomendaciones", d.recomendaciones],
];

export const nombreArchivo = (d: Informe, ext: string) =>
  `Informe_Psicologico_${(d.nombres || "informe").trim().replace(/\s+/g, "_")}.${ext}`;

export { logoUrl };

export async function logoDataUrl(): Promise<string> {
  const res = await fetch(logoUrl);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export async function logoBytes(): Promise<ArrayBuffer> {
  const res = await fetch(logoUrl);
  return res.arrayBuffer();
}

export function descargar(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
