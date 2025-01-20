import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "../wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("37ABqiPxq5mQWLUKYN7oaHkv2qdZtq6DHiwybwSBbwej");

// Recipient address
const to = new PublicKey("EEbPMMHRTedC9xRpocYDRRDdiQmEpeY4MQj4E3jYWbZA");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    let sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    // console.log(
    //   `The From ATA address ${sourceTokenAccount.address.toBase58()}`
    // );
    // Get the token account of the toWallet address, and if it does not exist, create it

    let toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );

    // console.log(
    //     `The To ATA address ${toTokenAccount.address.toBase58()}`
    //   );

    // Transfer the new token to the "toTokenAccount" we just created

    let trx = await transfer(connection,keypair,sourceTokenAccount.address,toTokenAccount.address,keypair.publicKey,1);
    console.log(`The transaction ${trx}`);

  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
