'use client';
import React, { useEffect } from 'react';
import ProductForm from '../components/ProductForm';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { uploadImagesAndReturnUrls } from '@/helpers/imageHandling';

function AddProduct() {
    const router = useRouter();
    const [selectedFiles, setSelectedFiles] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    const onSave = async (values: any) => {
        try {
            setLoading(true);
            const imageUrls = await uploadImagesAndReturnUrls(selectedFiles);
            values.images = imageUrls;
            await axios.post("/api/product", values);
            message.success("Product created successfully");
            router.push("/profile?id=1");
        } catch (error: any) {
            message.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(selectedFiles);
    }, [selectedFiles]);

    return (
        <div>
            <h1 className='text-2xl font-bold text-gray-800'>
                Add Product
            </h1>
            <hr />
            <ProductForm
                setSelectedFiles={setSelectedFiles}
                loading={loading}
                onSave={onSave}
            />
        </div>
    );
}

export default AddProduct;
