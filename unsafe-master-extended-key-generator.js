#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const crypto = require("crypto");
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const { networks } = require("./networks");

const DEFAULT_BYTE_LENGTH = 16;

program
  .addHelpText("before", "generates a hex-encoded string of random data.")
  .addHelpText(
    "after",
    "\nWARNING: this tool is for educational  purposes only. Do not secure real funds with these keys."
  )
  .option(
    "-l, --length <length>",
    `the length of data to generate, in bytes: ${DEFAULT_BYTE_LENGTH}`
  )
  .option(
    "-e, --entropy <entropy>",
    `the hex-encoded entropy data to use instead of generating new random data.`
  )

  .parse(process.argv);

const options = program.opts();
if (options.entropy && options.length) {
  console.error("Cannot specify both entropy and length");
  process.exit(1);
}

let data;
if (options.entropy) {
  data = Buffer.from(options.entropy, "hex");
  console.log("using provided entropy   :", data.toString("hex"));
} else {
  // the use of the crypto library is better than a conventional random number generator
  // but you should never use this to secure real funds. This is for educational purposes only.
  const length = options.length || DEFAULT_BYTE_LENGTH;
  data = crypto.randomBytes(length);
  console.log("generated new entropy  :", data.toString("hex"));
}

const seed = crypto.createHash("sha256").update(data).digest();
console.log("seed                     :", seed.toString("hex"));

// as we've seen so far, the seed is just a series of random bytes
// first, let's directly generate an HMAC-512 hash of the seed
const hmac = crypto
  .createHmac("sha512", Buffer.from("Bitcoin seed", "utf8"))
  .update(seed)
  .digest("hex");
console.log("hmac512                  :", hmac);
console.log("hmac512 first half       :", hmac.slice(0, 64));
console.log("hmac512 second half      :", hmac.slice(64));

// now, let's do this the bip32 way:
const master = bip32.fromSeed(seed, networks.bitcoin);
// uncomment this line if you want to see the structure of the object created
// console.log(master);
console.log("bip32 master private key :", master.__D.toString("hex"));
console.log("bip32 master chain code  :", master.chainCode.toString("hex"));
