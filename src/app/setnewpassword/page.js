import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";



export default function Setnewpassword(){
    return(
        <main className="bg-black h-screen flex items-center justify-center">
        <div className="box-animate bg-[#f5f5f5] text-[#1b1b1b] flex items-center justify-center flex-col relative" style={{ backgroundImage: "url('/assets/loginimg.jpg')", backgroundSize: "cover", backgroundPosition: "center"}}>
          <div className="absolute inset-0 bg-white opacity-80"></div>
          <div className="my-12 mx-12 relative z-10">
            <h1 className="font-bold text-2xl flex items-center justify-center">Set New Password</h1>
            <p className="text-xs mb-4 flex justify-center items-center mt-2 ">Password must be atleast 8 characters long</p>
            <div>

            <Label htmlFor="password" className="font-bold">Password</Label>
            <Input 
                type="email"  
                id="reset-password"
                placeholder="Enter new password"
                className="mt-2 mb-2 bg-transparent rounded-xl border border-black"
            />

            <Label htmlFor="password" className="font-bold">Confirm Password</Label>
            <Input 
                type="email"  
                id="reset-password"
                placeholder="Confirm Password"
                className="mt-2 mb-2 bg-transparent rounded-xl border border-black"
            />

            </div>
            <Button type='submit' className="w-full mt-4 bg-[#1b1b1b] rounded-xl border border-black hover:bg-[#9c9c9c] hover:text-[#1b1b1b]" >
              Set Password
            </Button>
           
            </div>

            </div>

        
        

        </main>
    )
}
