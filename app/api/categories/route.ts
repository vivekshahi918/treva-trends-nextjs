import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/configs/dbConfig";
import Category from "@/models/categoryModels";
import { validateJWT } from "@/helpers/validateJWT";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const userId = await validateJWT(request);
        //check if category exist or not
        const reqBody = await request.json();
        const categoryExists = await Category.findOne({
            name: reqBody.name,
        });
        if (categoryExists) {
            throw new Error("Categories already exists");
        }

        reqBody.createdBy = userId;
        const category = new Category(reqBody);
        await category.save();

        return NextResponse.json({
            message: "Categories created successfully",
        });

    } catch (error: any) {
        return NextResponse.json(
            { message : error.message },
            {
                status: 500
            }
        );
    }
}

export async function GET(request : NextRequest){
    try{
        await validateJWT(request);
        const categories = await Category.find().populate("createdBy", "name").sort({createdAt: -1});
        return NextResponse.json({
            data:categories,
        });

    } catch(error: any) {
        return NextResponse.json(
            {message: error.message},
            {
                status: 500,
            }
        )
    }
}