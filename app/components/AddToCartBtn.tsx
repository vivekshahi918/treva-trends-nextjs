'use client';

import { Button, message } from 'antd';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AddProductToCart, CartState } from '../redux/cartSlice';
import { ProductInterface } from '@/interfaces';

function AddToCartBtn({product} : {
    product: ProductInterface
}) {
  const dispatch = useDispatch();
  const {cartItems}: CartState = useSelector((state: any) => state.cart);

  return (
    <div>
      <Button type="primary"
              className="btn-small"
              onClick={() =>{
                dispatch(AddProductToCart({
                  ...product,
                  quantity: 1,
                }));
                message.success("Added to cart");
              }}
              disabled={cartItems.some((item: ProductInterface) => item._id === product._id) || product.countInStock < 1}
              >
                Add to Cart</Button>
    </div>
  )
}

export default AddToCartBtn;
