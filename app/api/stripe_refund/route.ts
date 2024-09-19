import {NextRequest, NextResponse} from "next/server";
const stripe = require("stripe")(process.env.stripe_secret_key!);
import Order from "@/models/orderModel"


export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const transactionId = reqBody.transactionId;
        const refund = await stripe.refunds.create({
            payment_intent: transactionId,
        });

        //change order status to refund

        await Order.findOneAndUpdate(
            {_id : reqBody.orderId},
            {paymentstatus: "refund"}
        );
        return NextResponse.json({
            refund,
        });
    } catch (error:any) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {status : 500}
        );
    }
}