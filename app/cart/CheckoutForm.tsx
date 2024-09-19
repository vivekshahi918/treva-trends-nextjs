'use client'

import React from 'react'
import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button, message } from 'antd'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { CartState, ClearCart } from '../redux/cartSlice'
import { useRouter } from 'next/navigation'
import Loader from '../components/Loader'

function CheckoutForm({
  total, setShowCheckoutModal
} : {
  total:number, setShowCheckoutModal : any
}) {
    const [loading, setLoading] = React.useState(false);
    const elements = useElements();
    const stripe = useStripe();
    const {cartItems} : CartState = useSelector((state:any) => state.cart);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async (event:any) => {
        try {
            setLoading(true);
            event.preventDefault();
            if(!stripe || !elements){
                throw new Error("Stripe.js hasn't loaded yet.");
            }
            const result = await stripe.confirmPayment({
                elements,
                confirmParams:{
                    return_url:'http://localhost:3000/cart',
                },
                redirect: "if_required",
            });
            if(result.error){
                throw result.error;
            }
            message.success("Payment successful");

            //Save order to Database
            const orderPayload ={
                items:cartItems,
                paymentStatus: 'paid',
                orderStatus: 'Order placed',
                shippingAddress: result.paymentIntent.shipping,
                transactionId: result.paymentIntent.id,
                total,

            };
            await axios.post("/api/orders/place_order", orderPayload);
            dispatch(ClearCart());
            message.success("Order placed successfully");
            router.push("/profile");
        } catch (error:any) {
            message.error(error.message);
        } finally{
            setLoading(false);
        }
    };
  return (
    <div>
      {loading && <Loader/>}
      <form onSubmit={handleSubmit}>
        <div className="h-[300px] overflow-y-scroll pr-5">
      <PaymentElement />
      <AddressElement 
      options={{
        allowedCountries: ["India"],
        mode : "shipping",
      }}/>
      </div>
      <div className="flex gap-5">
      <Button  htmlType="submit"
      className='mt-5'
      block
      onClick={()=>setShowCheckoutModal(false)}
      >
        Cancel
      </Button>
      <Button type="primary" htmlType="submit"
      className='mt-5'
      block
      loading ={loading}
      >
        Pay
      </Button>
      </div>
    </form>
    </div>
  )
}

export default CheckoutForm
