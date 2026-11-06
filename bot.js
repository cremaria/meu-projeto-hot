const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const { randomBytes } = require('crypto');
chromium.use(stealth);

const TOTAL_ACCOUNTS = 50; // Quantas contas você quer criar
const TELEGRAM_LINK = 'https://t.me/SEU_CANAL'; // COLOQUE SEU LINK AQUI
const MEDIA_PATH = 'C:\\Users\\artur\\OneDrive\\Área de Trabalho\\meu-projeto-hot\\foto.jpg';

async function generateRandomUser() {
    const id = randomBytes(3).toString('hex');
    return {
        username: `hot_vip_${id}`,
        fullName: `Model VIP ${id}`,
        password: `Pass${id}2024!`,
        email: `${id}@tempmail.com` // Nota: Você precisará de emails reais ou API de tempmail
    };
}

class HotFactory {
    constructor() {
        this.accounts = JSON.parse(fs.readFileSync('accounts.json', 'utf8') || '[]');
    }

    async initBrowser() {
        this.browser = await chromium.launch({ headless: false });
        this.page = await this.browser.newPage({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        });
    }

    async humanDelay(min = 2000, max = 5000) {
        await new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1) + min)));
    }

    async createAccount(user) {
        try {
            await this.page.goto('https://www.instagram.com/accounts/emailsignup/');
            await this.humanDelay();
            await this.page.fill('input[name="email"]', user.email);
            await this.page.fill('input[name="full_name"]', user.fullName);
            await this.page.fill('input[name="username"]', user.username);
            await this.page.fill('input[name="password"]', user.password);
            await this.humanDelay();
            await this.page.click('button[type="submit"]');
            await this.page.waitForTimeout(5000); 
            console.log(`Conta ${user.username} criada!`);
            return true;
        } catch (e) {
            console.log(`Erro ao criar ${user.username}:`, e.message);
            return false;
        }
    }

    async warmup(account) {
        console.log(`Aquecendo conta ${account.username}...`);
        await this.page.goto('https://www.instagram.com/');
        // Aqui o bot simularia likes e follows
        await this.humanDelay(5000, 10000);
    }

    async postStory(account) {
        console.log(`Postando Story no funil para ${account.username}...`);
        // (Aqui entra a função de postar story com link que te mandei antes)
    }

    async startFactory() {
        await this.initBrowser();
        for (let i = 0; i < TOTAL_ACCOUNTS; i++) {
            const user = await generateRandomUser();
            const success = await this.createAccount(user);
            if (success) {
                user.status = 'warming_up';
                this.accounts.push(user);
                fs.writeFileSync('accounts.json', JSON.stringify(this.accounts, null, 2));
                await this.warmup(user);
            }
        }
    }
}

const factory = new HotFactory();
factory.startFactory().catch(console.error);
