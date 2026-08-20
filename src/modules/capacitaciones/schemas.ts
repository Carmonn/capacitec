import { z } from "zod";

export const respuestaSchema = z.object({
  calificacion: z.number(),
  preguntas: z.array(
    z.object({
      preguntaId: z.string(),
      respuestaId: z.string(),
    }),
  ),
});
export const participanteSchema = z.object({
  id: z.string(),
  nombre: z.string().nullable(),
  apellidoPaterno: z.string().nullable(),
  apellidoMaterno: z.string().nullable(),
  curp: z.string().nullable(),
  diagnostico: respuestaSchema.optional(),
  final: respuestaSchema.optional(),
});
export type Participante = z.infer<typeof participanteSchema>;

export const capacitacionRawSchema = z.object({
  fechaCapacitacion: z.date(),
  cliente: z.string(),
  formularioRef: z.string(),
  participantes: z.array(participanteSchema).optional(),
});
export const capacitacionSchema = capacitacionRawSchema.extend({
  id: z.string(),
  formularioNombre: z.string(),
});

export type CapacitacionRaw = z.infer<typeof capacitacionRawSchema>;
export type Capacitacion = z.infer<typeof capacitacionSchema>;
