import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import wallet from "../wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
  try {
    // Start here
    console.log("Creating your min-account.....");
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      keypair.publicKey,
      6
    );
    console.log(`The mint account pubkey is: ${mint.toString()}`);

    let mintAccount = await connection.getAccountInfo(mint, "confirmed");
    // console.log("The mint accountInfo", JSON.stringify(mintAccount));
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();

// Hear we are creating the Mint Account.
