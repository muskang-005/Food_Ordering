// orderActions.js
export const updateWalletOnOrder = (amount) => {
    return (dispatch, getState) => {
        const { wallet } = getState();
        const newBalance = wallet.balance - amount;

        dispatch({
            type: 'UPDATE_WALLET',
            payload: newBalance,
        });
    };
};
