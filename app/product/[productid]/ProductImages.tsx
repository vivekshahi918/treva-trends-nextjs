'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";

function ProductImages({
  product = {}
}: {
  product: any;
}) {
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product.images]);

  return (
    <div className='flex gap-5 flex-col md:flex-row'>
      <div className='flex md:flex-col flex-row gap-5'>
        {product.images.map((image: any) => (
          <div
            key={image}
            onClick={() => setSelectedImage(image)}>
            <Image 
              src={image} 
              alt="" 
              height={50} 
              width={50}
              className={`object-cover cursor-pointer border  border-solid  p-2  border-gray-300 ${
                selectedImage === image && 'border-solid border-black border-2'
              }`}
            />
          </div>
        ))}
      </div>
      <Image src={selectedImage} alt="" height={400} width={400} />
    </div>
  );
}

export default ProductImages;
