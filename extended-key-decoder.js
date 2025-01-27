#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const { getNetworksForExtendedKey } = require("./networks");
const { translateIndex } = require("./utils");

program
  .addHelpText("before", "decodes an extended key.")
  .requiredOption("-k, --key <key>", "the extended key to decode")
  .option(
    "-p, --public",
    "also print the public key derived from the provided private extended key"
  )
  .parse(process.argv);

const options = program.opts();

const keyNetworks = getNetworksForExtendedKey(options.key);
const key = bip32.fromBase58(options.key, keyNetworks.current);

if (key.privateKey) {
  console.log(
    "version     :",
    key.network.bip32.private.toString(16).padStart(10, "0x0")
  );
} else {
  console.log(
    "version     :",
    key.network.bip32.public.toString(16).padStart(10, "0x0")
  );
}

console.log("depth       :", key.depth);

const index = translateIndex(key.index);
console.log("hardened    :", index.hardened);
console.log("index       :", index.index);
console.log("index (val) :", index.value);

console.log(
  "fingerprint :",
  "0x".concat(Buffer.from(key.fingerprint).toString("hex"))
);

if (key.privateKey) {
  console.log(
    "private key :",
    "0x".concat(Buffer.from(key.privateKey).toString("hex"))
  );
  console.log("            :", key.privateKey);
}

if (!key.privateKey || options.public) {
  console.log(
    "public key  :",
    "0x".concat(Buffer.from(key.publicKey).toString("hex"))
  );
  console.log("            :", key.publicKey);
}

console.log(
  "chain code  :",
  "0x".concat(Buffer.from(key.chainCode).toString("hex"))
);
console.log("            :", key.chainCode);
