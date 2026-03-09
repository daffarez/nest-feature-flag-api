import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateFlagSchema = z.object({
  key: z.string().min(3),
  environment: z.enum(['dev', 'prod']),
  description: z.string().optional(),
  isActive: z.boolean().default(false),
  rules: z.array(z.object({ region: z.string(), enabled: z.boolean() })),
});

export class CreateFlagDto extends createZodDto(CreateFlagSchema) {}
