import zod from 'zod';

export const createUserSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6),
    photo: zod.string().optional()
});

export type typeCreateUserSchema = zod.infer<typeof createUserSchema>
