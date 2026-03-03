import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { updateOrderFromSocket } from '../store/slices/orderSlice';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        // Initialize socket - remove /api from REACT_APP_API_URL if it exists
        const baseUrl = (process.env.REACT_APP_API_URL || '').replace(/\/api\/?$/, '');

        const newSocket = io(baseUrl, {
            withCredentials: true,
        });
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        if (user) {
            // Join appropriate rooms based on role
            socket.emit('joinUserRoom', user._id);

            if (user.role === 'admin') {
                socket.emit('joinAdminRoom');
            }
            if (user.role === 'agent') {
                socket.emit('joinAgentRoom');
            }
        }

        // Global listeners
        socket.on('orderStatusUpdated', (data) => {
            toast.success(data.message, {
                duration: 5000,
                position: 'top-right',
                icon: '📦',
            });
            dispatch(updateOrderFromSocket({ orderId: data.orderId, status: data.status }));
        });

        socket.on('newOrder', (data) => {
            toast.success(data.message, {
                duration: 5000,
                position: 'top-right',
                icon: '🛍️',
            });
        });

        return () => {
            socket.off('orderStatusUpdated');
            socket.off('newOrder');
        };
    }, [socket, user, dispatch]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
