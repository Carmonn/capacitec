import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import type * as z from "zod";

export function useZodForm<TSchema extends z.ZodTypeAny>(schema: TSchema) {
  return useForm<z.infer<TSchema>>({
    validationSchema: toTypedSchema(schema),
  });
}
