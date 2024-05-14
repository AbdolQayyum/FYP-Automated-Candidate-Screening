import { connect } from '@/dbConnection/dbConnection';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';


connect();
/**
 * Handles the POST request.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a response object.
 */

export async function POST(request) {
    try {
        const reqBody = await request.json(); //mits like middle which can returns all values

        //extracting token
        const {token} = reqBody;
        console.log(token);

        const user = await User.findOne({verifyToken : token, verifyTokenExpiry : {$gt: Date.now()}}) // match token from database 
        
        if (!user){
            return NextResponse.json({error:"Invalid Token"},
                {status:500})
        }

        console.log(user)
        // changings in user model values 
        // on app
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        // save in databse

        await user.save();

        return NextResponse.json({
            message:"Email verified successfully",
            success : true
        },
            {status:500})

    } catch (error) {
        return NextResponse.json({error: error.message},
            {status:500}
        )
        
    }
}