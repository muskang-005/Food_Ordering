// walletReducer.js
const initialState = {
  balance: 0, // Set your initial balance here
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
      case 'ADD_MONEY':
          return {
              ...state,
              balance: state.balance + action.payload,
          };
      case 'REMOVE_MONEY':
          return {
              ...state,
              balance: state.balance - action.payload,
          };
      case 'UPDATE_WALLET':
          return {
              ...state,
              balance: action.payload,
          };
      default:
          return state;
  }
};

export default walletReducer;
