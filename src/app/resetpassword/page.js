import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export default function Resetpassword(){
    return(
        <main className="bg-black h-screen flex items-center justify-center">
        <div className="box-animate bg-[#f5f5f5] text-[#1b1b1b] flex items-center justify-center flex-col relative" style={{ backgroundImage: "url('/assets/loginimg.jpg')", backgroundSize: "cover", backgroundPosition: "center"}}>
          <div className="absolute inset-0 bg-white opacity-80"></div>
          <div className="my-12 mx-12 relative z-10">
            <h1 className="font-bold text-2xl flex items-center justify-center">Reset Password</h1>
            <p className="text-xs mb-4 flex justify-center items-center mt-2 ">Please enter your email or number to reset password</p>
            <div>
           
            <Input 
                type="email"  
                id="reset-password"
                placeholder="Enter Your Email Address"
                className="mt-2 mb-2 bg-transparent rounded-xl border border-black"
            />

            </div>
            <Button type='submit' className="w-full mt-4 bg-[#1b1b1b] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b]" >
              Reset Password
            </Button>
           
            </div>

            </div>

        
        

        </main>
    )
}
