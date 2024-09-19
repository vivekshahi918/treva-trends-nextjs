'use client';

import { Badge, Divider, message, Popover } from 'antd';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Loader from './components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentUser } from './redux/userSlice';
import { CartState } from './redux/cartSlice';

function LayoutProvider({ children }: { children: React.ReactNode }) {
    const { currentUser } = useSelector((state: any) => state.user);
    const { cartItems }: CartState = useSelector((state: any) => state.cart || { cartItems: [] });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isPrivatePage = pathname !== "/auth/login" && pathname !== "/auth/register";

    useEffect(() => {
        // Check if state is correctly populated
        console.log('Cart Items:', cartItems);
        setHydrated(true);
    }, [cartItems]);

    const getCurrentUser = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/auth/currentUser');
            dispatch(SetCurrentUser(response.data.data));
        } catch (error: any) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }, [dispatch]);
    
    useEffect(() => {
        if (isPrivatePage) {
            getCurrentUser();
        }
    }, [pathname, isPrivatePage, getCurrentUser]);

    const onLogout = async () => {
        try {
            setLoading(true);
            await axios.get("/api/auth/logout");
            message.success("Logout successfully");
            dispatch(SetCurrentUser(null));
            router.push("/auth/login");
        } catch (error: any) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const content = (
        <div className='flex flex-col gap-2 p-2'>
            <div className="flex gap-2 items-center cursor-pointer text-md" onClick={() => router.push("/profile")}>
                <i className="ri-shield-user-line"></i>
                <span>Profile</span>
            </div>

            <div className="flex gap-2 items-center cursor-pointer text-md" onClick={onLogout}>
                <i className="ri-logout-box-r-line"></i>
                <span>LogOut</span>
            </div>
        </div>
    );

    return (
        <div>
            {loading && <Loader />}
            {isPrivatePage && currentUser && (
                <>
                    <div className='bg-primary py-2 px-5 flex justify-between items-center'>
                        <div className='flex gap-2 cursor-pointer' onClick={() => router.push("/")}>
                            <h1 className='text-2xl font-bold text-red-500'>Treva</h1>
                            <h1 className='text-2xl font-bold text-blue-500'>Trends</h1>
                        </div>
                        <div className="flex gap-5 items-center">
                            {hydrated && (
                                <Badge count={cartItems.length} className='cursor-pointer' >
                                    <i className="ri-shopping-cart-line text-white text-2xl"
                                    onClick={() => router.push("/cart")}></i>
                                </Badge>
                            )}
                            <Popover content={content} trigger="click">
                                <div className="flex h-8 w-8 bg-white p-2 rounded-full items-center justify-center cursor-pointer">
                                    <span>{currentUser.name[0]}</span>
                                </div>
                            </Popover>
                        </div>
                    </div>
                    <div className="p-5">
                        {children}
                    </div>
                </>
            )}
            {!isPrivatePage && children}
        </div>
    );
}

export default LayoutProvider;
