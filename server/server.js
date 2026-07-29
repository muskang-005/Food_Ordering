const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;
const secretKey = 'your-secret-key';

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'food_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL.');
});

// Signup route
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)';
    db.query(query, [username, email, hashedPassword, 'user'], (err, result) => {
        if (err) {
            console.error('Error signing up:', err);
            return res.status(500).json({ message: 'Failed to sign up' });
        }
        res.json({ message: 'Signup successful' });
    });
});

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ message: 'Failed to log in' });
        }

        if (results.length > 0) {
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign({ username: user.username, userType: user.userType, userId: user.id }, secretKey, { expiresIn: '1h' });
                res.json({ token, userType: user.userType, userId: user.id });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Get all products
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Error fetching products' });
        }
        res.json(results);
    });
});

// Add a new product
app.post('/api/products', (req, res) => {
    const { dish, imgdata, address, somedata, price, rating } = req.body;
    const query = 'INSERT INTO products (dish, imgdata, address, somedata, price, rating) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [dish, imgdata, address, somedata, price, rating], (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).json({ message: 'Error adding product' });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// Update an existing product
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { dish, imgdata, address, somedata, price, rating } = req.body;
    const query = 'UPDATE products SET dish = ?, imgdata = ?, address = ?, somedata = ?, price = ?, rating = ? WHERE id = ?';
    db.query(query, [dish, imgdata, address, somedata, price, rating, id], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ message: 'Error updating product' });
        }
        res.json({ id, ...req.body });
    });
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ message: 'Error deleting product' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// Get wallet balance
app.get('/api/wallet/:userId', (req, res) => {
    const { userId } = req.params;
    const query = 'SELECT balance FROM wallets WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching wallet balance:', err);
            return res.status(500).json({ message: 'Error fetching wallet balance' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.json({ balance: results[0].balance });
    });
});

// Add money to wallet
app.post('/api/wallet/add', (req, res) => {
    const { userId, amount } = req.body;
    const sqlSelectWallets = 'SELECT * FROM `wallets` WHERE user_id = ?'
    const sqlInsertWallets = 'INSERT INTO wallets (user_id, balance) VALUES (?, ?)';
    const sqlUpdateWallets = 'UPDATE wallets SET balance=balance+? WHERE user_id=?;';
    console.log('1. server: add wallet amount: ', userId, amount);

    db.query(sqlSelectWallets, [userId], (err, result) => {
        console.log("::::> ", err, result);
        if (result.length) {
          db.query(sqlUpdateWallets, [amount, userId], (err, result) => {
            res.json({ message: 'Money updated successfully!' });
          });
        } else {
          db.query(sqlInsertWallets, [userId, amount], (err) => {
            res.json({ message: 'Money added successfully!' });
          });
        }

        const historyQuery = 'INSERT INTO wallet_history (user_id, amount, type) VALUES (?, ?, "credit")';
        db.query(historyQuery, [userId, amount], (historyErr) => {
            if (historyErr) {
                console.error('Error logging wallet transaction:', historyErr);
            }
        });

        
    });
});

// Place order
app.post('/api/orders', (req, res) => {
    const { oid, productIds, user_id } = req.body;

    const totalAmountQuery = 'SELECT SUM(price) AS totalAmount FROM products WHERE id IN (?)';
    db.query(totalAmountQuery, [productIds], (err, results) => {
        if (err) {
            console.error('Error calculating total amount:', err);
            return res.status(500).json({ message: 'Failed to calculate total amount' });
        }

        if (results.length === 0 || results[0].totalAmount == null) {
            return res.status(400).json({ message: 'No products found' });
        }

        const totalAmount = results[0].totalAmount;

        const walletQuery = 'SELECT balance FROM wallets WHERE user_id = ?';
        db.query(walletQuery, [user_id], (walletErr, walletResults) => {
            if (walletErr) {
                console.error('Error checking wallet balance:', walletErr);
                return res.status(500).json({ message: 'Error checking wallet balance' });
            }

            if (walletResults.length === 0 || walletResults[0].balance < totalAmount) {
                return res.status(400).json({ message: 'Insufficient wallet funds' });
            }
            
            const orderQuery = 'INSERT INTO orders(oid, productIds, user_id, total_amount) VALUES (?, ?, ?, ?)';
            let _proudctIds = JSON.stringify(productIds).replace('[', '').replace(']', '');
            // console.log(_proudctIds)
            // INSERT INTO orders (user_id, product_ids, total_amount) VALUES (3, '3, 4, 5', 500);
            db.query(orderQuery, [oid, _proudctIds, user_id, totalAmount], (orderErr) => {
                if (orderErr) {
                    console.error('Error placing order:', orderErr);
                    return res.status(500).json({ message: 'Failed to place order' });
                }

                const updateWalletQuery = 'UPDATE wallets SET balance = balance - ? WHERE user_id = ?';
                db.query(updateWalletQuery, [totalAmount, user_id], (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating wallet:', updateErr);
                    }

                    const historyQuery = 'INSERT INTO wallet_history (user_id, amount, type) VALUES (?, ?, "debit")';
                    db.query(historyQuery, [user_id, totalAmount], (historyErr) => {
                        if (historyErr) {
                            console.error('Error logging wallet transaction:', historyErr);
                        }
                    });

                    res.json({ message: 'Order placed successfully' });
                });
            });
        });
    });
});

// Get orders for a specific user
app.get('/api/orders/:userId', (req, res) => {
    const userId = req.params.userId; // Assuming userId is sent as a query parameter
    console.log('orders: userid: ', userId);

    const query = 'SELECT * FROM orders WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ message: 'Failed to fetch orders' });
        }
        console.log('result: orders: ', results);
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
