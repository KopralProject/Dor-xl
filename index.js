require('dotenv').config();
const { Telegraf, Scenes, session } = require('telegraf');
const { XLService } = require('./services/xlService');
const { UserService } = require('./services/userService');

const bot = new Telegraf(process.env.BOT_TOKEN);
const xlService = new XLService();
const userService = new UserService();

// Middleware
bot.use(session());

// Start command
bot.command('start', async (ctx) => {
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['🚀 Dor Paket', '📱 Cek Status'],
                ['📝 Tutorial', '⚙️ Settings'],
                ['💰 Deposit', '👤 Profile']
            ],
            resize_keyboard: true
        }
    };

    await ctx.reply(
        '🎉 Selamat datang di XL Package DOR Bot!\n\n' +
        'Bot ini akan membantu Anda mendapatkan paket XL dengan harga spesial.\n\n' +
        '⚠️ Pastikan nomor yang digunakan adalah XL/Axis',
        keyboard
    );
});

// Dor Paket Menu
bot.hears('🚀 Dor Paket', async (ctx) => {
    const packages = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🔥 Combo 5GB - 15rb', callback_data: 'pkg_combo_5' },
                    { text: '🔥 Combo 10GB - 25rb', callback_data: 'pkg_combo_10' }
                ],
                [
                    { text: '🌙 Malam 5GB - 10rb', callback_data: 'pkg_night_5' },
                    { text: '🌙 Malam 10GB - 15rb', callback_data: 'pkg_night_10' }
                ],
                [
                    { text: '📱 Unlimited - 50rb', callback_data: 'pkg_unlimited' },
                    { text: '🎮 Gaming - 30rb', callback_data: 'pkg_gaming' }
                ]
            ]
        }
    };

    await ctx.reply('Pilih paket yang ingin di-DOR:', packages);
});

// Package selection handler
bot.action(/pkg_(.+)/, async (ctx) => {
    const packageId = ctx.match[1];
    ctx.session.selectedPackage = packageId;

    await ctx.reply(
        '📱 Silakan kirim nomor XL/Axis Anda\n' +
        'Format: 087812345678\n\n' +
        '⚠️ Pastikan nomor sudah benar!'
    );
    ctx.session.awaitingPhoneNumber = true;
});

// Phone number handler
bot.on('text', async (ctx) => {
    if (ctx.session.awaitingPhoneNumber) {
        const phoneNumber = ctx.message.text;

        if (!phoneNumber.match(/^(0878|0817|0818|0819|0859|0877|0878)\d{8}$/)) {
            return ctx.reply('❌ Format nomor tidak valid! Pastikan menggunakan nomor XL/Axis.');
        }

        await ctx.reply('🔄 Memproses pembelian paket...');

        try {
            const result = await xlService.buyPackage(phoneNumber, ctx.session.selectedPackage);
            await ctx.reply(
                '✅ *Pembelian Berhasil*\n\n' +
                `📱 Nomor: ${phoneNumber}\n` +
                `📦 Paket: ${result.packageName}\n` +
                `💰 Harga: Rp ${result.price}\n` +
                `📅 Masa Aktif: ${result.validity}\n\n` +
                '🎉 Selamat menikmati paket internet Anda!',
                { parse_mode: 'Markdown' }
            );
        } catch (error) {
            await ctx.reply('❌ Gagal membeli paket. Silakan coba lagi nanti.');
        }

        ctx.session.awaitingPhoneNumber = false;
        ctx.session.selectedPackage = null;
    }
});

// Tutorial command
bot.hears('📝 Tutorial', async (ctx) => {
    await ctx.reply(
        '*Tutorial Penggunaan Bot*\n\n' +
        '1. Klik tombol "🚀 Dor Paket"\n' +
        '2. Pilih paket yang diinginkan\n' +
        '3. Masukkan nomor XL/Axis\n' +
        '4. Tunggu proses selesai\n\n' +
        '⚠️ *Syarat & Ketentuan*\n' +
        '- Pastikan pulsa mencukupi\n' +
        '- Nomor tidak dalam masa tenggang\n' +
        '- Maksimal 3 kali per hari\n' +
        '- Jam operasional: 00:00 - 23:59 WIB',
        { parse_mode: 'Markdown' }
    );
});

bot.launch()
    .then(() => console.log('Bot is running...'))
    .catch(err => console.error('Bot launch error:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
