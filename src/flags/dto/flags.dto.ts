import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const FlagRuleSchema = z.object({
  region: z.string(),
  enabled: z.boolean(),
});

export const EnvironmentEnum = z.enum(['dev', 'prod']);

const CreateFlagSchema = z.object({
  key: z.string().min(3),
  environment: EnvironmentEnum,
  description: z.string().optional(),
  isActive: z.boolean().default(false),
  rules: z.array(FlagRuleSchema).default([]),
});

const UpdateFlagSchema = CreateFlagSchema.partial();

export type Environment = z.infer<typeof EnvironmentEnum>;

export class FlagRulesDto extends createZodDto(FlagRuleSchema) {}
export class CreateFlagDto extends createZodDto(CreateFlagSchema) {}
export class UpdateFlagDto extends createZodDto(UpdateFlagSchema) {}
