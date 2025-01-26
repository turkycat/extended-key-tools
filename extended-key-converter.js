#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const { networks, getNetworksForExtendedKey } = require("./networks");

program
  .addHelpText(
    "before",
    "converts a given extended key between networks or from private to public."
  )
  .requiredOption("-k, --key <key>", "the extended key to convert")
  .option("-p, --public", "convert extended private key to public key")
  .option(
    "-x",
    "convert the key to a xprv or xpub format appropriate for the network"
  )
  .option(
    "-y",
    "convert the key to a yprv or ypub format appropriate for the network"
  )
  .option(
    "-z",
    "convert the key to a zprv or zpub format appropriate for the network"
  )
  .parse(process.argv);

const options = program.opts();
if (
  (options.x && options.y) ||
  (options.x && options.z) ||
  (options.y && options.z)
) {
  console.log("only one of -x, -y, or -z can be used at a time");
  process.exit(1);
}

const keyNetworks = getNetworksForExtendedKey(options.key);
const key = bip32.fromBase58(options.key, keyNetworks.current);
let convertToNetwork =
  keyNetworks.current === keyNetworks.mainnet
    ? keyNetworks.testnet
    : keyNetworks.mainnet;
if (options.x) {
  convertToNetwork =
    keyNetworks.current === keyNetworks.mainnet
      ? networks.mainnet
      : networks.testnet;
}
if (options.y) {
  convertToNetwork =
    keyNetworks.current === keyNetworks.mainnet
      ? networks.mainnetYpub
      : networks.testnetYpub;
}
if (options.z) {
  convertToNetwork =
    keyNetworks.current === keyNetworks.mainnet
      ? networks.mainnetZpub
      : networks.testnetZpub;
}

if (options.public) {
  if (!key.privateKey) {
    console.log("given key is already public");
    process.exit(1);
  }

  console.log(key.neutered().toBase58());
  process.exit(0);
}

key.network = convertToNetwork;
console.log(key.toBase58());
