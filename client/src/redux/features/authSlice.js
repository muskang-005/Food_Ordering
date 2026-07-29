// authSlice.js 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            console.log('login response: ', data);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            console.log("addCase: ", action.payload);
            state.isAuthenticated = true;
            state.user = action.payload;
            state.token = action.payload.token;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.error = action.payload;
        });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
