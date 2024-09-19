'use client'

import React, { useEffect } from 'react';
import { Button, message, Table } from 'antd';
import axios from 'axios';
import moment from "moment";
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import next/image

function ProductList() {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [products, setProducts] = React.useState([]);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
  const [selectedProduct, setselectedProduct] = React.useState<any>(null);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/product");
      setProducts(response.data.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = async (productId: string) => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/api/product/${productId}`);
      message.success("Product deleted successfully");
      getProducts();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      render: (text: String, record: any) => (
        // Replacing img with next/image
        <Image 
          src={record.images[0]} 
          alt={text as string}
          width={80} // Set appropriate width
          height={80} // Set appropriate height
          className="w-20 h-20 object-cover rounded-full"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      render: (createdBy: any) => {
        if (!createdBy) {
          return "Unknown";
        }
        return createdBy.name ? createdBy.name : "Unknown";
      }
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt: any) => moment(createdAt).format("DD MM YYYY"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (action: any, params: any) => (
        <div className="flex gap-3 items-center">
          <Button 
            type='default' 
            className='btn-small'
            onClick={() => {
              setselectedProduct(params);
              deleteProduct(params._id);
            }}
            loading={deleteLoading && selectedProduct?._id === params._id}
          >
            Delete
          </Button>
          <Button 
            type='primary' 
            className='btn-small'
            onClick={() => router.push(`/profile/edit_product/${params._id}`)}
          >
            Edit
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div>
      <div className='flex justify-end'>
        <Button
          type='primary'
          onClick={() => router.push("/profile/add_product")}
        >
          Add Product
        </Button>
      </div>
      <div className="mt-5">
        <Table columns={columns} dataSource={products} loading={loading} pagination={false} />
      </div>
    </div>
  );
}

export default ProductList;
