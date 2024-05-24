import zod from 'zod';

export const createUserSchema = zod.object({
    id: zod.string().optional(),
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6),
    photo: zod.string().optional().nullable(),
    deleted_at: zod.date().optional().nullable(),
    id_permission: zod.string().optional().nullable(),
});



export const authUserSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
});

export type typeCreateUserSchema = zod.infer<typeof createUserSchema>
export type typeAuthUserSchema = zod.infer<typeof authUserSchema>
