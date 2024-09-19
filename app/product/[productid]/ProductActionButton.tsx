'use client'

import { Button } from 'antd'
import React from 'react'

function ProductActionButton({
    product
}: {
    product : any
}) {
  return (
    <div className='flex gap-5 mt-5'>
        <Button type='default'
        disabled={product.countInStock <  1}>Add to Cart</Button>
        <Button type='primary'
        disabled={product.countInStock < 1}>Buy Now</Button>
    </div>
  )
}

export default ProductActionButton
