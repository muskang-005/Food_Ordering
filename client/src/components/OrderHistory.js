import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Assuming you're using Redux

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const user = useSelector((state) => state.auth.user); // Assuming you have user in your Redux store

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !user.userId) {
                console.error('User is not defined or user ID is not available');
                return; // Exit if user is not defined
            }

            try {
                const response = await fetch(`http://localhost:5000/api/orders/${user.userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('>> fetch orders: ', data);
                setOrders(data); // Adjust according to your API response
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [user]);

    console.log('>>>>>> UI orders: ', orders);    

    return (
        <div>
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul>
                    {orders.map(order => {
                        let productIds = order.productIds.split(',');
                        return (
                        <div key={order.oid} style={{background: 'white', borderRadius: 10, boxShadow: '2px 2px 2px black', padding: 10, margin: 24}}>
                            <h3>{order.oid}</h3>
                            <p>Ordered items:</p>
                            {productIds.map((items, index) => <li key={index}>{items}</li>)}
                            <div>Ordered placed at: {order.created_at} </div>
                        </div>
                        );
                    }
                    )}
                </ul>
            )}
        </div>
    );
};

export default OrderHistory;
