import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { FileImage, FileText, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HojaInforme } from "@/components/HojaInforme";
import {
  PROFESIONAL,
  TARJETA,
  descargar,
  logoUrl,
  nombreArchivo,
  type Informe,
} from "@/lib/informe";
import { generarPdf } from "@/lib/informe-pdf";
import { generarDocx } from "@/lib/informe-docx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Informe de Atención Psicológica | Martha Cecilia Morales" },
      {
        name: "description",
        content:
          "Formato digital para elaborar y descargar en PDF, Word o PNG informes de atención psicológica: datos generales, examen mental, dinámica familiar y recomendaciones.",
      },
      {
        property: "og:title",
        content: "Informe de Atención Psicológica | Martha Cecilia Morales",
      },
      {
        property: "og:description",
        content:
          "Crea y descarga informes psicológicos profesionales en PDF, Word o PNG desde una sola página.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const hoy = new Date();

const inicial: Informe = {
  dia: String(hoy.getDate()).padStart(2, "0"),
  mes: String(hoy.getMonth() + 1).padStart(2, "0"),
  anio: String(hoy.getFullYear()),
  nombres: "",
  documento: "",
  edad: "",
  sexo: "",
  nacimiento: "",
  hermanos: "",
  escolarizacion: "",
  estadoCivil: "",
  motivo: "",
  examenMental: "",
  dinamicaFamiliar: "",
  areaEscolar: "",
  antecedentes: "",
  recomendaciones: "",
};

function Seccion({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-[0_1px_2px_rgba(20,60,55,0.04)] sm:p-8">
      <div className="mb-6 flex items-baseline gap-3 border-b border-border pb-3">
        <span className="font-sans text-xs font-semibold tracking-[0.2em] text-primary/60">
          {numero}
        </span>
        <h2 className="font-display text-xl text-foreground">{titulo}</h2>
      </div>
      {children}
    </section>
  );
}

function Campo({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium tracking-wide text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background"
      />
    </div>
  );
}

function CampoTexto({
  id,
  label,
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium tracking-wide text-muted-foreground">
        {label}
      </Label>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y bg-background leading-relaxed"
      />
    </div>
  );
}

function Index() {
  const [d, setD] = useState<Informe>(inicial);
  const [cargando, setCargando] = useState<string | null>(null);
  const hojaRef = useRef<HTMLDivElement>(null);
  const set = (k: keyof Informe) => (v: string) =>
    setD((prev: Informe) => ({ ...prev, [k]: v }));

  const descargarPng = async () => {
    const nodo = hojaRef.current?.firstElementChild as HTMLElement | null;
    if (!nodo) return;
    const dataUrl = await toPng(nodo, { pixelRatio: 2, backgroundColor: "#ffffff" });
    const blob = await (await fetch(dataUrl)).blob();
    descargar(blob, nombreArchivo(d, "png"));
  };

  const ejecutar = async (clave: string, fn: () => Promise<void>) => {
    setCargando(clave);
    try {
      await fn();
    } finally {
      setCargando(null);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-6">
          <img
            src={logoUrl}
            alt="Marca personal de Martha Cecilia Morales, psicóloga"
            width={56}
            height={56}
            className="size-14"
          />
          <div>
            <h1 className="font-display text-2xl leading-tight text-foreground">
              Atención Psicológica
            </h1>
            <p className="text-sm text-muted-foreground">
              {PROFESIONAL} · T.P {TARJETA}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        <Seccion numero="I" titulo="Fecha del informe">
          <div className="grid max-w-md grid-cols-3 gap-4">
            <Campo id="dia" label="Día" value={d.dia} onChange={set("dia")} />
            <Campo id="mes" label="Mes" value={d.mes} onChange={set("mes")} />
            <Campo id="anio" label="Año" value={d.anio} onChange={set("anio")} />
          </div>
        </Seccion>

        <Seccion numero="II" titulo="Datos generales">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Campo
                id="nombres"
                label="Nombres y apellidos"
                value={d.nombres}
                onChange={set("nombres")}
                placeholder="Nombre completo del paciente"
              />
            </div>
            <Campo
              id="documento"
              label="Documento de identidad"
              value={d.documento}
              onChange={set("documento")}
            />
            <Campo
              id="edad"
              label="Edad"
              value={d.edad}
              onChange={set("edad")}
              placeholder="14 años"
            />
            <Campo id="sexo" label="Sexo" value={d.sexo} onChange={set("sexo")} />
            <Campo
              id="nacimiento"
              label="Fecha de nacimiento"
              value={d.nacimiento}
              onChange={set("nacimiento")}
            />
            <Campo
              id="hermanos"
              label="Número de hermanos"
              value={d.hermanos}
              onChange={set("hermanos")}
            />
            <Campo
              id="estadoCivil"
              label="Estado civil"
              value={d.estadoCivil}
              onChange={set("estadoCivil")}
            />
            <div className="sm:col-span-2">
              <Campo
                id="escolarizacion"
                label="Escolarización"
                value={d.escolarizacion}
                onChange={set("escolarizacion")}
                placeholder="Institución / grado"
              />
            </div>
          </div>
        </Seccion>

        <Seccion numero="III" titulo="Valoración">
          <div className="space-y-6">
            <CampoTexto
              id="motivo"
              label="Motivo de consulta"
              rows={3}
              value={d.motivo}
              onChange={set("motivo")}
            />
            <CampoTexto
              id="examen"
              label="Examen mental aparente"
              value={d.examenMental}
              onChange={set("examenMental")}
            />
            <CampoTexto
              id="dinamica"
              label="Dinámica familiar"
              value={d.dinamicaFamiliar}
              onChange={set("dinamicaFamiliar")}
            />
            <CampoTexto
              id="escolar"
              label="Área escolar"
              value={d.areaEscolar}
              onChange={set("areaEscolar")}
            />
            <CampoTexto
              id="antecedentes"
              label="Antecedentes relevantes"
              value={d.antecedentes}
              onChange={set("antecedentes")}
            />
          </div>
        </Seccion>

        <Seccion numero="IV" titulo="Recomendaciones">
          <CampoTexto
            id="recomendaciones"
            label="Orientaciones brindadas"
            rows={8}
            value={d.recomendaciones}
            onChange={set("recomendaciones")}
          />
        </Seccion>

        <Seccion numero="V" titulo="Firma y registro profesional">
          <div className="flex flex-wrap items-center gap-5 rounded-md bg-secondary/50 px-6 py-5">
            <img src={logoUrl} alt="" width={48} height={48} className="size-12" />
            <div>
              <p className="font-semibold text-foreground">{PROFESIONAL.toUpperCase()}</p>
              <p className="text-sm text-muted-foreground">
                Psicóloga · Tarjeta profesional {TARJETA}
              </p>
            </div>
            <span className="ml-auto rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              Datos fijos
            </span>
          </div>
        </Seccion>

        <Seccion numero="VI" titulo="Descargar informe">
          <p className="mb-6 text-sm text-muted-foreground">
            Elige el formato en el que deseas guardar el informe.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Button
              variant="outline"
              size="lg"
              className="h-auto flex-col gap-2 py-6"
              disabled={cargando !== null}
              onClick={() => ejecutar("pdf", () => generarPdf(d))}
            >
              <FileText className="size-6 text-primary" />
              <span>{cargando === "pdf" ? "Generando…" : "PDF"}</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-auto flex-col gap-2 py-6"
              disabled={cargando !== null}
              onClick={() => ejecutar("word", () => generarDocx(d))}
            >
              <FileType2 className="size-6 text-primary" />
              <span>{cargando === "word" ? "Generando…" : "Word"}</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-auto flex-col gap-2 py-6"
              disabled={cargando !== null}
              onClick={() => ejecutar("png", descargarPng)}
            >
              <FileImage className="size-6 text-primary" />
              <span>{cargando === "png" ? "Generando…" : "PNG"}</span>
            </Button>
          </div>
        </Seccion>

        <p className="pb-6 text-center text-xs italic text-muted-foreground">
          “Este documento es de carácter confidencial y no podrá ser utilizado para otros fines
          distintos para los que ha sido realizado, ni divulgarse”
        </p>
      </main>

      {/* Hoja usada únicamente para exportar la imagen PNG */}
      <div ref={hojaRef} className="pointer-events-none fixed -left-[2000px] top-0" aria-hidden>
        <HojaInforme d={d} id="hoja-informe" />
      </div>
    </div>
  );
}
