const axios = require('axios');
const crypto = require('crypto');

class XLService {
    constructor() {
        this.baseURL = process.env.XL_API_URL;
        this.apiKey = process.env.XL_API_KEY;
        this.secret = process.env.XL_SECRET;
    }

    async buyPackage(phoneNumber, packageId) {
        try {
            const timestamp = Date.now();
            const signature = this._generateSignature(phoneNumber, timestamp);

            const headers = {
                'X-API-KEY': this.apiKey,
                'X-SIGNATURE': signature,
                'X-TIMESTAMP': timestamp
            };

            // Simulasi pembelian paket
            const packageDetails = this._getPackageDetails(packageId);
            
            // Di sini seharusnya ada integrasi dengan API XL yang sebenarnya
            await this._simulateDelay();

            return {
                success: true,
                packageName: packageDetails.name,
                price: packageDetails.price,
                validity: '30 hari',
                transactionId: this._generateTransactionId()
            };
        } catch (error) {
            throw new Error('Failed to purchase package: ' + error.message);
        }
    }

    _getPackageDetails(packageId) {
        const packages = {
            'pkg_combo_5': { name: 'Combo 5GB', price: 15000 },
            'pkg_combo_10': { name: 'Combo 10GB', price: 25000 },
            'pkg_night_5': { name: 'Malam 5GB', price: 10000 },
            'pkg_night_10': { name: 'Malam 10GB', price: 15000 },
            'pkg_unlimited': { name: 'Unlimited', price: 50000 },
            'pkg_gaming': { name: 'Gaming', price: 30000 }
        };

        return packages[packageId] || { name: 'Unknown Package', price: 0 };
    }

    _generateSignature(phoneNumber, timestamp) {
        const data = `${phoneNumber}:${timestamp}:${this.secret}`;
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    _generateTransactionId() {
        return 'TRX' + Date.now() + Math.random().toString(36).substr(2, 5);
    }

    _simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }
}

module.exports = { XLService };
