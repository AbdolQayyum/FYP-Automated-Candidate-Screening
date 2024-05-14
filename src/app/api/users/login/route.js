import { connect } from '@/dbConnection/dbConnection';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";

connect();

/**
 * Handles the POST request.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a response object.
 */

export async function POST(request) {

    try {

        const reqBody = await request.json();
        const {email, password } = reqBody;
        // Validation
        console.log(reqBody);

        const user = await User.findOne({email})

        if (!user){
            return NextResponse.json({error: "User does not exist"},
                {status:500})

        }

        console.log("User Exists")

        const validPassword = await bcryptjs.compare(password,user.password)

        if(!validPassword){
            return NextResponse.json({error: "Check Your Credentials"},
                {status:400})

        }

        //making jwt token
        const tokenData={
            id : user._id,
            username:user.username,
            email:user.email,
        }

        // builtin function in jwt that can make sign tokens
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: '1d'})

        const response = NextResponse.json({
            message:"Logged In Success",
            success: true,
        })
        // it is the type of NextResponse so we can access cookies
        response.cookies.set("token",token,{
            httpOnly:true
        })

        return response

        
    } catch (error) {
        return NextResponse.json({error: error.message},
            {status:500})
        
    }

}