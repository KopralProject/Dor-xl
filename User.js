const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    packageId: String,
    packageName: String,
    phoneNumber: String,
    price: Number,
    status: String,
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    telegramId: { type: Number, required: true, unique: true },
    phoneNumber: String,
    balance: { type: Number, default: 0 },
    transactions: [transactionSchema],
    createdAt: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
