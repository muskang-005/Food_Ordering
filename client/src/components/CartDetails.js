// CartDetails.js
import React, { useEffect, useState } from 'react';
import "./cartstyle.css";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeToCart, removeSingleItem, emptyCart } from '../redux/features/cartSlice';
import toast from 'react-hot-toast';
import WalletModal from './WalletModal';
import { updateWalletOnOrder } from '../actions/orderActions'; // Action to update wallet
import './WalletModal.css';

const CartDetails = () => {
    const { carts } = useSelector((state) => state.allCart);
    const balance = useSelector(state => state.wallet.balance);
    const user = useSelector(state => state.auth.user);

    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [isWalletModalOpen, setWalletModalOpen] = useState(false);

    const dispatch = useDispatch();

    function uuidv4() {
        return 'order-xxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }

    const placeOrder = async () => {
        const productIds = carts.map((prod) => prod.id);
        const totalCost = totalPrice; // Calculate total cost
        const userId = user?.userId; // Access user ID

        console.log('User object:', user); // Log user object
        console.log('Wallet Balance:', balance);
        console.log('Total Cost:', totalCost);
        console.log('User ID:', userId);

        // Check if user ID is valid
        if (!userId) {
            toast.error('You must be logged in to place an order.');
            return;
        }

        // Check wallet balance
        if (totalCost > balance) {
            toast.error('Insufficient wallet balance to place the order.');
            return;
        }

        let oid = uuidv4();
        let cart = { oid, productIds, user_id: userId };
        console.log('Place order; ', cart);
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cart),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to place order: ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            dispatch(updateWalletOnOrder(totalCost)); // Deduct amount from wallet
            toast.success('Order placed successfully');
            dispatch(emptyCart());
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order');
        }
    };

    const handleIncrement = (item) => {
        dispatch(addToCart(item));
    };

    const handleDecrement = (item) => {
        dispatch(removeToCart(item.id));
        toast.success("Item Removed From Your Cart");
    };

    const handleSingleDecrement = (item) => {
        dispatch(removeSingleItem(item));
    };

    const emptyCartHandler = () => {
        dispatch(emptyCart());
        toast.success("Your Cart is Empty");
    };

    const total = () => {
        let totalPrice = 0;
        carts.forEach((item) => {
            totalPrice += item.price * item.qnty;
        });
        setTotalPrice(totalPrice);
    };

    const countQuantity = () => {
        let totalQuantity = 0;
        carts.forEach((item) => {
            totalQuantity += item.qnty;
        });
        setTotalQuantity(totalQuantity);
    };

    useEffect(() => {
        total();
    }, [carts]);

    useEffect(() => {
        countQuantity();
    }, [carts]);

    return (
        <div className='row justify-content-center m-0'>
            <div className='col-md-8 mt-5 mb-5 cardsdetails'>
                <div className="card">
                    <div className="card-header bg-dark p-3">
                        <div className='card-header-flex'>
                            <h5 className='text-white m-0'>Cart Calculation {carts.length > 0 ? `(${carts.length})` : ""}</h5>
                            {carts.length > 0 && (
                                <button className='btn btn-danger mt-0 btn-sm' onClick={emptyCartHandler}>
                                    <i className='fa fa-trash-alt mr-2'></i><span>Empty Cart</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {carts.length === 0 ? (
                            <table className='table cart-table mb-0'>
                                <tbody>
                                    <tr>
                                        <td colSpan={6}>
                                            <div className='cart-empty'>
                                                <i className='fa fa-shopping-cart'></i>
                                                <p>Your Cart Is Empty</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <table className='table cart-table mb-0 table-responsive-sm'>
                                <thead>
                                    <tr>
                                        <th>Action</th>
                                        <th>Product</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th className='text-right'>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carts.map((data) => (
                                        <tr key={data.id}>
                                            <td>
                                                <button className='prdct-delete' onClick={() => handleDecrement(data)}>
                                                    <i className='fa fa-trash-alt'></i>
                                                </button>
                                            </td>
                                            <td>
                                                <div className='product-img'>
                                                    <img src={data.imgdata} alt="" />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='product-name'>
                                                    <p>{data.dish}</p>
                                                </div>
                                            </td>
                                            <td>₹ {data.price}</td>
                                            <td>
                                                <div className="prdct-qty-container">
                                                    <button className='prdct-qty-btn' type='button'
                                                        onClick={data.qnty <= 1 ? () => handleDecrement(data) : () => handleSingleDecrement(data)}
                                                    >
                                                        <i className='fa fa-minus'></i>
                                                    </button>
                                                    <input type="text" className='qty-input-box' value={data.qnty} disabled />
                                                    <button className='prdct-qty-btn' type='button' onClick={() => handleIncrement(data)}>
                                                        <i className='fa fa-plus'></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className='text-right'>₹ {data.qnty * data.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th colSpan={3}>&nbsp;</th>
                                        <th>Items In Cart <span className='ml-2 mr-2'>:</span><span className='text-danger'>{totalQuantity}</span></th>
                                        <th className='text-right'>Total Price <span className='ml-2 mr-2'>:</span><span className='text-danger'>₹ {totalPrice}</span></th>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>
                </div>
                <button className="btn btn-primary" onClick={placeOrder}>Place Order</button>
                <button onClick={() => setWalletModalOpen(true)} className="open-wallet-btn">Open Wallet</button>
                {isWalletModalOpen &&
                    <WalletModal onClose={() => setWalletModalOpen(false)} />
                }
            </div>
        </div>
    );
};

export default CartDetails;
