import * as zod from'zod';

export const schema = zod.object({
        name: zod.string().nonempty('Name is required').min(3,'atleast 3 letters').max(20,'Atmost 20 letters'),
        email: zod.string().nonempty('Email is required').regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , 'Invalid email'),
        password:zod.string().nonempty('Password is invalid').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'weak password'),
        repassword:zod.string().nonempty('repassword is required'),
        dateOfBirth:zod.coerce.date('date is required').refine((value)=>{
            const userAge = value.getFullYear();
            const now = new Date().getFullYear();
            const diff = now - userAge
            return diff >= 18 
        },'age less than 18'),
        gender:zod.string().nonempty('gender is required')
    }).refine((data)=>data.password === data.repassword,{path:'repassword', message:'password and repassword must be the same'})
