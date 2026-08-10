import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generarPdf, type Informe } from "@/lib/informe-pdf";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Informe de Atención Psicológica | Martha Cecilia Morales" },
      {
        name: "description",
        content:
          "Formato digital para elaborar y descargar en PDF informes de atención psicológica: datos generales, examen mental, dinámica familiar y recomendaciones.",
      },
      {
        property: "og:title",
        content: "Informe de Atención Psicológica | Martha Cecilia Morales",
      },
      {
        property: "og:description",
        content:
          "Crea y descarga informes psicológicos profesionales en PDF desde una sola página.",
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
  profesional: "Martha Cecilia Morales",
  tarjeta: "173792",
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
  const set = (k: keyof Informe) => (v: string) => setD((p) => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-md bg-primary font-display text-sm font-semibold text-primary-foreground">
              MM
            </div>
            <div>
              <h1 className="font-display text-2xl leading-tight text-foreground">
                Atención Psicológica
              </h1>
              <p className="text-sm text-muted-foreground">
                {d.profesional} · T.P {d.tarjeta}
              </p>
            </div>
          </div>
          <Button onClick={() => generarPdf(d)} className="gap-2">
            <Download className="size-4" />
            Descargar PDF
          </Button>
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
            <Campo id="edad" label="Edad" value={d.edad} onChange={set("edad")} placeholder="14 años" />
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
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo
              id="profesional"
              label="Profesional"
              value={d.profesional}
              onChange={set("profesional")}
            />
            <Campo
              id="tarjeta"
              label="Tarjeta profesional"
              value={d.tarjeta}
              onChange={set("tarjeta")}
            />
          </div>
        </Seccion>

        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-secondary/50 px-6 py-8 text-center">
          <FileText className="size-6 text-primary/70" />
          <p className="max-w-md text-sm text-muted-foreground">
            El informe se genera con el formato institucional y la nota de confidencialidad al pie
            de cada página.
          </p>
          <Button onClick={() => generarPdf(d)} size="lg" className="gap-2">
            <Download className="size-4" />
            Descargar informe en PDF
          </Button>
        </div>

        <p className="pb-6 text-center text-xs italic text-muted-foreground">
          “Este documento es de carácter confidencial y no podrá ser utilizado para otros fines
          distintos para los que ha sido realizado, ni divulgarse”
        </p>
      </main>
    </div>
  );
}
