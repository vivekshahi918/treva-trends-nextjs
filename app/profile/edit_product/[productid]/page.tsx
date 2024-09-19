'use client';

import React from 'react';
import ProductForm from '../../components/ProductForm';
import axios from 'axios';
import { message } from 'antd';
import Loader from '@/app/components/Loader';
import { uploadImagesAndReturnUrls } from '@/helpers/imageHandling';
import { useRouter } from 'next/navigation';

function EditProduct({ params }: { params: any }) {
  const [existingImages, setExistingImages] = React.useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<any[]>([]);
  const [loadingProduct, setLoadingProduct] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [product, setProduct] = React.useState<any>(null);
  const router = useRouter();

  const onSave = async (values: any) => {
    try {
      setLoading(true);
      const newImages = await uploadImagesAndReturnUrls(selectedFiles);
      const updatedImages = [...existingImages, ...newImages];
      values.images = updatedImages;
      await axios.put(`/api/product/${params.productid}`, values);
      message.success("Product updated successfully");
      router.refresh();
      router.back();
    } catch (error: any) {
      message.error(error.message || error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = React.useCallback(async () => {
    try {
      setLoadingProduct(true);
      const response = await axios.get(`/api/product/${params.productid}`);
      setExistingImages(response.data.images);
      setProduct(response.data);
    } catch (error: any) {
      message.error(error.message || error.response.data.message);
    } finally {
      setLoadingProduct(false);
    }
  }, [params.productid]); // Include params.productid as a dependency

  React.useEffect(() => {
    getProduct();
  }, [getProduct]); // Include getProduct as a dependency

  return (
    <div>
      {loadingProduct && <Loader />}
      <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
      <hr />
      {product && (
        <ProductForm
          setSelectedFiles={setSelectedFiles}
          loading={loading}
          onSave={onSave}
          initialValues={product}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
        />
      )}
    </div>
  );
}

export default EditProduct;
