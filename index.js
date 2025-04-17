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

function isValidTransaction(type, description, amount) {
    return (
        (type === 'income' || type === 'expense') &&
        typeof description === 'string' &&
        typeof amount === 'number'
    );
};

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
    if (!isValidTransaction(type, description, amount)){
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

// PUT route to update a transaction
app.put('/transactions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { type, description, amount } = req.body;
    if (!isValidTransaction(type, description, amount)){
        return res.status(400).json({ error: 'Invalid transaction data' });
    }
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.type = type;
    transaction.description = description;
    transaction.amount = amount;
    return res.status(200).json(transaction);
    
})

// DELETE route to delete a transaction
app.delete('/transactions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const transactionIndex = transactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) {
        return res.status(404).json({ error: 'Transaction not found' });
    } else {
        transactions.splice(transactionIndex, 1);
        return res.status(204).send();
    }
});

// Initiate the server
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });