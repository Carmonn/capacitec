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

export const formularioCreateSchema = formularioJsonSchema.extend({
  nombre: z.string(),
  fechaCreacion: z.date(),
});

export const formularioSchema = formularioJsonSchema.extend({
  id: z.string(),
  nombre: z.string(),
  fechaCreacion: z.date(),
});

export type FormularioJson = z.infer<typeof formularioJsonSchema>;
export type FormularioCreate = z.infer<typeof formularioCreateSchema>;
export type Formulario = z.infer<typeof formularioSchema>;
