import * as zod from'zod';

export const loginschema = zod.object({
        email: zod.string().nonempty('Email is required').regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , 'Invalid email'),
        password:zod.string().nonempty('Password is invalid').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'weak password'),
})
