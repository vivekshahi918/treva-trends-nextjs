import { message, Modal, Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSelector } from 'react-redux';

function UserOrdersList() {
    const [loading = false, setLoading] = React.useState<boolean>(false);
    const [showCancelModel = false, setShowCancelModel] = React.useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
    const [statusUpdateLoading = false, setStatusUpdateLoading] = React.useState<boolean>(false);
    const [orders = [], setOrders] = React.useState([]);
    const router = useRouter();
    const { currentUser } = useSelector((state: any) => state.user)

    const getOrders = async () => {
        try {
            setLoading(true);
            const endPoint = `/api/orders?user=${currentUser._id}`;
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
            const endPoint = `/api/orders/${orderId}`;
            await axios.put(endPoint, { orderStatus: status });
            message.success("Your Order has been Cancelled successfully, Thank You");
            setShowCancelModel(false);
            getOrders();
        } catch (error: any) {
            message.error(error.response.data.message);
        } finally {
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
            title: 'Placed On',
            dataIndex: 'createdAt',
            render: (date: string) => moment(date).format('DD MMM YYYY hh:mm a')
        }, {
            title: 'Total',
            dataIndex: 'total',
        }, {
            title: "Status",
            dataIndex: "orderStatus",
            render: (status: string) => status.toUpperCase()
        }, {
            title: "Action",
            render: (record: any) => (
                <div className="flex gap-5">
                    {record.orderStatus !== "shipped"  && record.orderStatus !=="cancelled" && (<span 
                    className='underline cursor-pointer'
                        onClick={() => {
                            setSelectedOrder(record);
                            setShowCancelModel(true);
                        }}
                    >
                        Cancel
                    </span>)}
                    <span className='underline cursor-pointer'
                        onClick={() => {
                            router.push(`/profile/orders/${record._id}`);
                        }}
                    >
                        View
                    </span>
                </div>
            ),
        },
    ]
    return (
        <div>
            <Table columns={columns} dataSource={orders} rowKey="_id"
                loading={loading} pagination={false} />

            {selectedOrder && (
                <Modal
                    open={showCancelModel}
                    onCancel={() => {
                        setShowCancelModel(false);
                    }}
                    title="Cancel Order"
                    centered
                    closable={false}
                    onOk={() => {
                        onStatusUpdate(selectedOrder._id, "cancelled");
                    }}
                    okText="Yes, Cancel Order"
                    cancelText="No, Keep Order"
                    okButtonProps={{
                        loading: statusUpdateLoading,
                    }}
                >
                    <p className='my-10 text-gray-600'>
                        Are you sure you want to cancel order a{selectedOrder._id} ? This action cannot be undone.
                    </p>
                </Modal>
            )}
        </div>
    )
}

export default UserOrdersList;
