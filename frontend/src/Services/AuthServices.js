import axios from "axios";
export async function SignUp(userData){
    try{
        let{data} = await axios.post('https://linked-posts.routemisr.com/users/signup',userData)
    } catch (err){
        console.log(err.response.data)

    }
}
export async function Signin(userData){
    try{
        let{data} = await axios.post('https://linked-posts.routemisr.com/users/signup',userData)
    } catch (err){
        console.log(err.response.data)

    }
}