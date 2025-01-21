import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Blob } from "buffer";
import { PinataSDK } from "pinata-web3";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import wallet from "../wallet.json";

// Initialize environment variables
dotenv.config();

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

// Create a signer from the wallet's secret key
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

// Use required UMI functionalities
umi.use(irysUploader());
umi.use(signerIdentity(signer));

// Main function to handle the metadata upload
(async () => {
  try {
    const imageUri = await uploadImage(); // Upload the image first
    const metadataUri = await uploadMetadata(imageUri); // Upload metadata

    console.log("Metadata URI: ", metadataUri);

  } catch (error) {
    console.error("Error: ", error);
  }
})();

// Function to upload image to Pinata and get the URI
async function uploadImage() {
  try {
    const pinata = initializePinata();

    const filePath = path.join(process.cwd(), "/cluster1/buddha.jpg");
    const file = createFileFromPath(filePath, "image/jpeg");

    const upload = await pinata.upload.file(file);
    const imageUri = `${process.env.GATEWAY_URL}/ipfs/${upload.IpfsHash}`;

    console.log("Image URI: ", imageUri);
    return imageUri;
  } catch (error) {
    throw new Error(`Error uploading image: ${error}`);
  }
}

// Function to upload metadata to Pinata and get the URI
async function uploadMetadata(imageUri: string) {
  try {
    const pinata = initializePinata();

    const metadata = {
      name: "Brahma",
      symbol: "BRMA",
      description: "I am the creator of everything.",
      image: imageUri,
      attributes: [
        { trait_type: "Gender", value: "Male" },
        { trait_type: "Type", value: "Green" },
        { trait_type: "Expression", value: "Peace" },
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: imageUri,
          },
        ],
      },
      creators: [
        {
          address: "12r4uFpQHVvVfX3qpAxHhddExdGMecFSZYPcVhxRPZNm",
          verified: true,
          share: 100,
        },
      ],
    };

    const filePath = path.join(process.cwd(), "/cluster1/nft_metadata.json");
    const file = createFileFromPath(filePath, "application/json");

    const upload = await pinata.upload.file(file);
    const metadataUri = `${process.env.GATEWAY_URL}/ipfs/${upload.IpfsHash}`;

    console.log("Metadata URI: ", metadataUri);
    return metadataUri;
  } catch (error) {
    throw new Error(`Error uploading metadata: ${error}`);
  }
}

// Utility function to initialize Pinata SDK with environment variables
function initializePinata() {
  return new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL,
  });
}

// Utility function to create a file from a given path
function createFileFromPath(filePath: string, mimeType: string) {
  const blob = new Blob([fs.readFileSync(filePath)]);
  return new File([blob], path.basename(filePath), { type: mimeType });
}
