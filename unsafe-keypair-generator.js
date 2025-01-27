#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const crypto = require("crypto");
const bitcoin = require("bitcoinjs-lib");
const ECPairFactory = require("ecpair").default;
const ecc = require("tiny-secp256k1");
const ECPair = ECPairFactory(ecc);

const DEFAULT_BYTE_LENGTH = 16;

program
  .addHelpText("before", "generates a 256-bit private key using sha256.")
  .addHelpText(
    "after",
    "\nWARNING: this tool is for educational  purposes only. Do not secure real funds with these keys."
  )
  .option(
    "-l, --length <length>",
    `the length of entropy data to generate, in bytes: ${DEFAULT_BYTE_LENGTH}`
  )
  .option(
    "-e, --entropy <entropy>",
    `the hex-encoded entropy data to use instead of generating new entropy data.`
  )
  .option(
    "-p, --private-key <privateKey>",
    `the hex-encoded private key to use instead of generating new entropy data.`
  )
  .parse(process.argv);

const options = program.opts();
const specifiedOptions = [
  options.length,
  options.entropy,
  options.privateKey,
].filter(Boolean);
if (specifiedOptions.length > 1) {
  console.error(
    "Cannot specify more than one of --length, --entropy, or --private-key"
  );
  process.exit(1);
}

let privateKey;
let data;
if (options.privateKey) {
  privateKey = Buffer.from(options.privateKey, "hex");
  console.log("provided private key   :", privateKey.toString("hex"));
} else {
  if (options.entropy) {
    data = Buffer.from(options.entropy, "hex");
    console.log("provided entropy       :", data.toString("hex"));
  } else {
    // the use of the crypto library is better than a conventional random number generator
    // but you should never use this to secure real funds. This is for educational purposes only.
    const length = options.length || DEFAULT_BYTE_LENGTH;
    data = crypto.randomBytes(length);
    console.log("generated new entropy  :", data.toString("hex"));
  }
}

// note that we're hashing the data in binary form, even though the conventional
// format for representing binary data to human readers is in hex
if (!privateKey) {
  privateKey = crypto.createHash("sha256").update(data).digest("hex");
  console.log("private key            :", privateKey);
}

// now, let's use the private key to generate a public key using ECDSA
const keys = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"));
console.log(
  "public key             :",
  Buffer.from(keys.publicKey).toString("hex")
);
