import { message, Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import Loader from '@/app/components/Loader';


function AdminOrdersList() {
    const [loading = false, setLoading] = React.useState<boolean>(false);
    const [orders = [], setOrders] = React.useState([]);
    const router = useRouter();
    const [statusUpdateLoading = false, setStatusUpdateLoading] = React.useState<boolean>(false);

    const getOrders = async () => {
        try {
            setLoading(true);
            const endPoint = `/api/orders`;
            const response = await axios.get(endPoint);
            console.log(response.data);
            setOrders(response.data);
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onStatusUpdate = async (orderId: string, status: string) => {
      try {
        setStatusUpdateLoading(true);
        const endPoint= `/api/orders/${orderId}`;
        await axios.put(endPoint, {orderStatus : status});
        message.success("Order status updated successfully");
        getOrders();
      } catch (error:any) {
        message.error(error.response.data.message);
      }finally {
        setStatusUpdateLoading(false);
      }
    };

    const onRefundissue = async (orderId: string, transactionId: string) => {
        try {
            setStatusUpdateLoading(true);
            const endPoint =`/api/stripe_refund`;
            // await axios.post(endPoint, { orderId, transactionId});
            // message.success("Refund issued successfully");
            await axios.post(endPoint, { orderId, transactionId });
            message.success("Refund issued successfully");

            // Update the payment status to 'refund' after the refund is successful
            const updateEndPoint = `/api/orders/${orderId}`;
            await axios.put(updateEndPoint, { paymentStatus: "refund" });
            getOrders();


        } catch (error:any) {
            message.error(error.response.data.message);
        }finally{
            setStatusUpdateLoading(false);
        }
    };
    useEffect(() => {
        getOrders();
    }, []);
    const columns = [
        {
            title: "Order ID",
            dataIndex: "_id",
        }, {
            title: "User",
            dataIndex: "user",
            render:(user:any) => user.name,
        }, 
        {
            title: 'Placed On',
            dataIndex: 'createdAt',
            render: (date: string) => moment(date).format('DD MMM YYYY hh:mm a')
        }, {
            title: 'Total',
            dataIndex: 'total',
        }, {
            title: " Order Status",
            dataIndex: "orderStatus",
            render: (status: string, record : any) => (
                <div>
                    <select 
                    value={status}
                    onChange={(e) => {
                        onStatusUpdate(record._id, e.target.value);
                    }}
                    >
                        <option value="order placed">Order Placed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out of delivery">Out of Delivery</option>
                        <option value="delivered">Delivered</option>

                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            ),
        }, {
            title: "Payment Status",
            dataIndex: "paymentStatus",
            render: (status: string) => status.toUpperCase(),
        }, {
            title: "Action",
            render: (record: any) => (
                <div className="flex gap-5">
                    {record.orderStatus === "cancelled" && record.paymentStatus !== "refund" && (<span className='underline cursor-pointer'
                    onClick={() => {
                        onRefundissue(record._id, record.transactionId);
                    }}>
                    Issue Refund
                </span>)}
                    <span className='underline cursor-pointer'
                    onClick={() => {
                        router.push(`/profile/orders/${record._id}`);
                    }}
                >
                    View Details
                </span>
                </div>
            ),
        },
    ]
    return (
        <div>
          {statusUpdateLoading && <Loader /> }
            <Table columns={columns} dataSource={orders} rowKey="_id" 
            loading={loading} pagination={false}/>
        </div>
    )
}

export default AdminOrdersList;
