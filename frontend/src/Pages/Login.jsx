import { Button, Input, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Signin } from '../Services/AuthServices';
import { useNavigate ,Link } from 'react-router-dom';
import { loginschema } from '../assets/LoginSchema';
export default function Login() {
    const [loading , setLoading] = useState(false)
    const [apiError , setApiError] = useState(null)

    
    
    let {handleSubmit,register,formState:{errors}}= useForm({defaultValues:{
        email:'',
        password:'',
    }, resolver:zodResolver(loginschema),
        mode:'onBlur',
        reValidateMode:'onBlur'
    })
    const navigate = useNavigate()
    async function sendData(userData){
        setLoading(true)
        const res= await Signin(userData)
        setLoading(false)
        if(res.message == 'success'){
            localStorage.setItem('token',res.token)
           navigate('/')

        }else{
            setApiError(res.error)
        }
        console.log(res)
    }
  return (
    <>
   <div className="min-h-screen flex items-center justify-center px-4 ">
  <div className="bg-stone-50 p-8 py-24 rounded-2xl shadow-lg w-full max-w-lg">

    <h1 className="text-3xl text-amber-600 text-center mb-8">Login</h1>

    <form onSubmit={handleSubmit(sendData)} className="flex flex-col gap-4">

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

      <Button
        isLoading={loading}
        className="bg-amber-600 hover:bg-amber-700 text-white"
        type="submit"
      >
        Sign in
      </Button>

      {apiError && (
        <span className="text-center text-red-500">{apiError}</span>
      )}

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-amber-600 font-medium">
          Register
        </Link>
      </div>
    </form>
  </div>
</div>

    </>
  )}