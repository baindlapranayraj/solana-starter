import wallet from "../wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  CreatorArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
  generateSigner,
  KeypairSigner,
  keypairIdentity,
  
} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import {Metaplex, UploadMetadataInput} from "@metaplex-foundation/js"



// Define our Mint address
const mint = publicKey("GPwcteaPMn4Pus2BtTJ7Drt8XU8xT29GjvKhcnNRQpHX");

// Create a UMI connection
const umi = createUmi(clusterApiUrl("devnet"));
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer:KeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));


// Token Data Loaded in Off-chain
const MY_TOKEN_METADATA = {
  name:"Radha",
  symbol:"RDA",
  description:"Flower from Radha to Krishna",
  image:"https://i.pinimg.com/736x/c5/b6/39/c5b6393c0f8c608371636f49ff50c5b9.jpg"
};


(async () => {
  try {
    // Start here 
    // 👇🏻 All accounts involved for creating the Token Metadata 👇🏻
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint,
      mintAuthority:signer,
      payer:signer,
      updateAuthority:signer.publicKey
    };

    // The paint of your Token Canvas
    let data: DataV2Args = {
        name:MY_TOKEN_METADATA.name,
        symbol:MY_TOKEN_METADATA.symbol,
        uri:"https://lavender-worthy-duck-16.mypinata.cloud/ipfs/bafkreib77s3bj5o4nhzkujmaetk3ao74elwl2mvw3lext67vdrhzszliym",
        sellerFeeBasisPoints:0, 
        creators:null,
        collection:null,
        uses:null
    }
    let args: CreateMetadataAccountV3InstructionArgs = {
        data,
        isMutable:true,
        collectionDetails:null
    }
    let tx = createMetadataAccountV3(
        umi,
        {
            ...accounts,
            ...args
        }
    )
    let result = await tx.sendAndConfirm(umi);
    console.log(bs58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();


