// WalletModal.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMoney, removeMoney } from '../actions/walletActions';
import { updateWalletOnOrder } from '../actions/orderActions'; // New action for updating wallet on order
import './WalletModal.css';
import toast from 'react-hot-toast';

const WalletModal = ({ onClose }) => {
    const [amount, setAmount] = useState(0);
    const balance = useSelector(state => state.wallet.balance);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const handleAddMoney = async () => {
        const amountInt = parseInt(amount, 10);

        if (amountInt < 100 || amountInt > 500) {
            alert('Amount must be between 100 and 500 rupees');
            return;
        }
        try {
            console.log('before hitting wallet url', user.userId, amount );
            const response = await  fetch('http://localhost:5000/api/wallet/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId:user.userId, amount}),
            });
            
            console.log('after hitting wallet url', response);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add money: `);
            }

            const result = await response.json();
            dispatch(addMoney(amountInt));
            setAmount(0);
            
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order');
        }
    
        
    };

    

    const handleRemoveMoney = () => {
        dispatch(removeMoney(parseInt(amount, 10)));
        setAmount(0);
    };

    return (
        <div className="wallet-modal">
            <div className="wallet-content">
                <h2>Wallet</h2>
                <p>Balance: ₹{balance}</p>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                />
                <button onClick={handleAddMoney}>Add Money</button>
                <button onClick={handleRemoveMoney}>Remove Money</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default WalletModal;
