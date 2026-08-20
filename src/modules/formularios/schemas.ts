import { z } from "zod";

export const formularioJsonSchema = z.object({
  preguntas: z.array(
    z.object({
      id: z.string(),
      texto: z.string(),
      opciones: z.array(
        z.object({
          id: z.string(),
          texto: z.string(),
          correcta: z.boolean(),
        }),
      ),
    }),
  ),
});

export const formularioRawSchema = formularioJsonSchema.extend({
  nombre: z.string(),
  fechaCreacion: z.date(),
});

export const formularioSchema = formularioJsonSchema.extend({
  id: z.string(),
  nombre: z.string(),
  fechaCreacion: z.date(),
});

export type FormularioJson = z.infer<typeof formularioJsonSchema>;
export type FormularioRaw = z.infer<typeof formularioRawSchema>;
export type Formulario = z.infer<typeof formularioSchema>;
