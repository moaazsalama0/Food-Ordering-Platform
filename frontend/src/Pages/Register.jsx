import { Button, Input, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from'zod';
import { schema } from '../assets/RegisterSchema';
import { SignUp } from '../Services/AuthServices';
import { useNavigate ,Link } from 'react-router-dom';
export default function Register() {
    const [loading , setLoading] = useState(false)
    const [apiError , setApiError] = useState(null)

    
    
    let {handleSubmit,register,formState:{errors}}= useForm({defaultValues:{
        name:'',
        email:'',
        password:'',
        repassword:'',
        dateOfBirth:'',
        gender:'',

    }, resolver:zodResolver(schema),
        mode:'onBlur',
        reValidateMode:'onBlur'
    })
    const navigate = useNavigate()
    async function sendData(userData){
        setLoading(true)
        const res= await SignUp(userData)
        setLoading(false)
        if(res.message){
           navigate('/login')

        }else{
            setApiError(res.error)
        }
        console.log(res)
    }
  return (
    <>
  <div className="min-h-screen flex items-center justify-center px-4">
  <div className="bg-stone-50 rounded-2xl shadow-xl py-10 px-6 w-full max-w-sm md:max-w-lg">
    <h1 className="text-2xl text-amber-600 text-center mb-4">Register Now</h1>

    <form onSubmit={handleSubmit(sendData)} className="flex flex-col gap-4">

      <Input
        label="Name"
        type="text"
        variant="bordered"
        {...register("name")}
        isInvalid={Boolean(errors.name)}
        errorMessage={errors.name?.message}
      />

      <Input
        label="Email"
        type="email"
        variant="bordered"
        {...register("email")}
        isInvalid={Boolean(errors.email)}
        errorMessage={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        variant="bordered"
        {...register("password")}
        isInvalid={Boolean(errors.password)}
        errorMessage={errors.password?.message}
      />

      <Input
        label="Repassword"
        type="password"
        variant="bordered"
        {...register("repassword")}
        isInvalid={Boolean(errors.repassword)}
        errorMessage={errors.repassword?.message}
      />

      {/* Responsive row */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          label="Date of Birth"
          type="date"
          variant="bordered"
          className="w-full"
          {...register("dateOfBirth")}
          isInvalid={Boolean(errors.dateOfBirth)}
          errorMessage={errors.dateOfBirth?.message}
        />

        <Select
          variant="bordered"
          label="Gender"
          className="w-full"
          {...register("gender")}
          isInvalid={Boolean(errors.gender)}
          errorMessage={errors.gender?.message}
        >
          <SelectItem key="male">Male</SelectItem>
          <SelectItem key="female">Female</SelectItem>
        </Select>
      </div>

      <Button
        isLoading={loading}
        className="bg-amber-600 hover:bg-amber-700 text-white"
        type="submit"
      >
        Register
      </Button>

      { apiError && (
      <span className="text-center text-red-500">{apiError}</span>
     )}

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-amber-600 font-medium">
          Login
        </Link>
      </div>
    </form>
  </div>
</div>

    </>
  )}