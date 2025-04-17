const express = require('express');
const app = express();
const port = 3000;

// Middleware to accept JSON
app.use(express.json());

// Database simulation with a global array for the transactions
let transactions = [
    { id: 1, type: 'income', description: 'Freelance', amount: 1500 },
    { id: 2, type: 'expense', description: 'New computer', amount: 4500 }
];

// GET route to run a test
app.get('/', (req, res) => {
    res.send('Finance API working!');
});

// GET route to retrieve all transactions
app.get('/transactions', (req, res) => {
    res.json(transactions);
});

// GET route to retrieve the balance
app.get('/balance', (req, res) => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
        if (t.type === 'income') income += t.amount;
        else if (t.type === 'expense') expense += t.amount;
    })

    const balance = income - expense;
    res.json({
        income,
        expense,
        balance
    })
});


// POST route to add a new transaction
app.post('/transactions', (req, res) => {
    const { type, description, amount } = req.body;
    if (!type || (type !== 'income' && type !== 'expense') || !description || typeof description !== 'string' || !amount || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Invalid transaction data' });
    }
    const newTransaction = {
        id: transactions.length + 1,
        type,
        description,
        amount
    };
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
});

// Initiate the server
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });