import { Keypair, PublicKey, Connection, Commitment, clusterApiUrl } from "@solana/web3.js";
import {  getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection(clusterApiUrl("devnet"), commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("GPwcteaPMn4Pus2BtTJ7Drt8XU8xT29GjvKhcnNRQpHX");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection,keypair,mint,keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);
        console.log(" ");
        // let accountInfo = await connection.getAccountInfo(ata.address);
        // console.log("accountInfo: ",accountInfo);
    

        // Mint to ATA
        const mintTx = await mintTo(connection,keypair,mint,ata.address,keypair,token_decimals);

        console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()


