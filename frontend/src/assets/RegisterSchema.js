import * as zod from'zod';

export const schema = zod.object({
  name: zod.string().min(3, "Name is required"),
  email: zod.string().email("Invalid email"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  repassword: zod.string(),
  dateOfBirth: zod.string().nonempty("Date of Birth is required"),
  gender: zod.string().nonempty("Gender is required"),
  phone: zod.string()
    .regex(/^(010|011|012|015)[0-9]{8}$/, "Phone number must be a valid Egyptian number"),
}).refine((data) => data.password === data.repassword, {
  message: "Passwords do not match",
  path: ["repassword"],
});