import {
  CONFIDENCIALIDAD,
  PROFESIONAL,
  TARJETA,
  bloques,
  datosGenerales,
  logoUrl,
  type Informe,
} from "@/lib/informe";

/** Hoja A4 usada para exportar el informe como imagen PNG. */
export function HojaInforme({ d, id }: { d: Informe; id: string }) {
  return (
    <div
      id={id}
      className="w-[794px] bg-card px-14 py-12 font-sans text-[13px] leading-relaxed text-foreground"
    >
      <div className="flex items-center border border-primary">
        <div className="flex w-[110px] shrink-0 items-center justify-center border-r border-primary p-3">
          <img src={logoUrl} alt="Logo Martha Cecilia Morales" width={70} height={70} />
        </div>
        <div className="flex-1 py-4 text-center">
          <h2 className="font-display text-[22px] font-semibold tracking-wide">
            ATENCIÓN PSICOLÓGICA
          </h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {PROFESIONAL} · T.P {TARJETA}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <table className="border-collapse text-center text-[11px]">
          <tbody>
            <tr>
              {["Día", "Mes", "Año"].map((t) => (
                <th key={t} className="w-16 border border-primary px-2 py-1 text-primary">
                  {t}
                </th>
              ))}
            </tr>
            <tr>
              {[d.dia, d.mes, d.anio].map((v, i) => (
                <td key={i} className="border border-primary px-2 py-1">
                  {v}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mt-5 border-b border-border pb-1 text-[11px] font-semibold tracking-widest text-primary">
        I. DATOS GENERALES
      </h3>
      <dl className="mt-3 space-y-1.5">
        {datosGenerales(d).map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-4">
            <dt className="w-52 shrink-0 text-muted-foreground">{k}</dt>
            <dd className="min-w-0 flex-1 whitespace-nowrap font-semibold">{v || "—"}</dd>
          </div>
        ))}

      </dl>

      {bloques(d).map(([t, v]) => (
        <section key={t} className="mt-5">
          <h3 className="border-b border-border pb-1 text-[11px] font-semibold tracking-widest text-primary">
            {t.toUpperCase()}
          </h3>
          <p className="mt-2 whitespace-pre-wrap rounded-sm border border-border bg-secondary/40 px-4 py-3 text-justify">
            {v || "—"}
          </p>
        </section>
      ))}

      <p className="mt-10 text-[11px] font-semibold tracking-widest text-primary">
        FIRMA Y REGISTRO PROFESIONAL:
      </p>
      <div className="mt-16 text-center">
        <div className="mx-auto w-64 border-t border-foreground/70" />
        <p className="mt-2 font-semibold">{PROFESIONAL.toUpperCase()}</p>
        <p className="text-[12px]">T.P {TARJETA}</p>
      </div>

      <p className="mt-12 text-center text-[9px] italic text-muted-foreground">
        {CONFIDENCIALIDAD}
      </p>
    </div>
  );
}
