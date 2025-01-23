'use client'

import { Button } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux';
import { AddProductToCart } from '../../redux/cartSlice';

function ProductActionButton({
    product
}: {
    product: any
}) {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(AddProductToCart({ ...product, quantity: 1 }));
    };

    const handleBuyNow = () => {
        dispatch(AddProductToCart({ ...product, quantity: 1 }));
        // Redirect to the checkout page (assuming the route is /checkout)
        window.location.href = '/cart';
    };

    return (
        <div className='flex gap-5 mt-5'>
            <Button
                type='default'
                disabled={product.countInStock < 1}
                onClick={handleAddToCart}
            >
                Add to Cart
            </Button>
            <Button
                type='primary'
                disabled={product.countInStock < 1}
                onClick={handleBuyNow}
            >
                Buy Now
            </Button>
        </div>
    );
}

export default ProductActionButton;