const User = require('../models/User');

class UserService {
    async createUser(telegramId, phoneNumber) {
        try {
            const user = new User({
                telegramId,
                phoneNumber,
                balance: 0,
                transactions: []
            });
            return await user.save();
        } catch (error) {
            throw new Error('Failed to create user: ' + error.message);
        }
    }

    async addTransaction(telegramId, transaction) {
        try {
            const user = await User.findOne({ telegramId });
            if (!user) throw new Error('User not found');

            user.transactions.push(transaction);
            return await user.save();
        } catch (error) {
            throw new Error('Failed to add transaction: ' + error.message);
        }
    }
}

module.exports = { UserService };
