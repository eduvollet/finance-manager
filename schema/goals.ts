import { z } from "zod";

export const GoalSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
  targetAmount: z.coerce.number().positive({ message: "O valor alvo deve ser positivo" }),
  deadline: z.coerce.date(),
});

export type GoalSchemaType = z.infer<typeof GoalSchema>;
