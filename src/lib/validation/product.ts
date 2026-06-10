import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  imageUrl: z.string().trim().url("Enter a valid image URL"),
});

export type ProductInput = z.infer<typeof productSchema>;
