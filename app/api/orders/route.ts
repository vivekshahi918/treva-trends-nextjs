import {connectDB} from "@/configs/dbConfig";
import {NextResponse, NextRequest} from "next/server";
import order from "@/models/orderModel";
import { validateJWT } from "@/helpers/validateJWT";

connectDB();

export async function GET(request: NextRequest){
    try {
        await validateJWT(request);
        const searchParams = new URL(request.nextUrl).searchParams;
        const user = searchParams.get("user");
        const filters : any = {};
        if ( user ) filters["user"] = user;
        const orders = await order.find(filters).populate("user", "name email").sort({createdAt: -1});
        return NextResponse.json(orders);
    } catch (error:any) {
        return NextResponse.json({message:error.message}, {status:500});
    }
}