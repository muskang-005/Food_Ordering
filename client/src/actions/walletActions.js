//walletactions.js
export const ADD_MONEY = 'ADD_MONEY';
export const REMOVE_MONEY = 'REMOVE_MONEY';

export const addMoney = (amount) => {
  if (typeof amount !== 'number' || amount < 100 || amount > 500) {
    console.error('Amount must be between 100 and 500 rupees');
    return { type: ADD_MONEY, payload: 0 }; 
  }
  return {
    type: ADD_MONEY,
    payload: amount,
  };
};

export const removeMoney = (amount) => {
  if (typeof amount !== 'number' || amount <= 0) {
    console.error('Invalid amount');
    return { type: REMOVE_MONEY, payload: 0 }; 
  }
  return {
    type: REMOVE_MONEY,
    payload: amount,
  };
};
