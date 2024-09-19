import { connectDB } from "@/configs/dbConfig";
import User from "@/models/userModels";
import {NextRequest , NextResponse} from "next/server" ;
import bcrypt from "bcryptjs";

connectDB();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();  
        
        //check if user already exists
        const userExits = await User.findOne({ email: reqBody.email});
        if(userExits){
            throw new Error("User already exists");
        }
        // create new user 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(reqBody.password, salt);
        reqBody.password = hashedPassword;
        const newUser = new User(reqBody);
        await newUser.save();

        return NextResponse.json({
            message : "User created successfully",
            data : newUser
        });
    }catch(error: any){
        return NextResponse.json(
            {
                message: error.message,
            },
            { status : 400}
        );
    }
}