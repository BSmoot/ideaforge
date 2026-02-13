import { z } from 'zod';

export const CreateIdeaSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  content: z.string().default(''),
  tags: z.array(z.string()).default([]),
});

export type CreateIdeaInput = z.infer<typeof CreateIdeaSchema>;

export const UpdateIdeaSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim()
    .optional(),
  content: z.string().optional(),
  status: z
    .enum(['spark', 'developing', 'refined', 'parked', 'archived'])
    .optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type UpdateIdeaInput = z.infer<typeof UpdateIdeaSchema>;

export const AIConfigSchema = z.object({
  provider: z.enum(['anthropic', 'openai']),
  apiKey: z.string().min(1, 'API key is required'),
  model: z.string().min(1, 'Model is required'),
});

export type AIConfigInput = z.infer<typeof AIConfigSchema>;

export const SearchQuerySchema = z.object({
  query: z
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(200, 'Search query must be 200 characters or less'),
});

export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;

export const TagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name must be 50 characters or less')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Tag name can only contain letters, numbers, hyphens, and underscores'
    ),
});

export type TagInput = z.infer<typeof TagSchema>;
