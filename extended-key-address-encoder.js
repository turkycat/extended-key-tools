#!/usr/bin/env node

const { Command, Option } = require("commander");
const program = new Command();
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const { getNetworksForExtendedKey } = require("./networks");
const { toXOnly } = require("bitcoinjs-lib/src/psbt/bip371");

bitcoin.initEccLib(ecc);

program
  .addHelpText("before", "derives addresses from an extended key.")
  .requiredOption("-k, --key <key>", "the extended key to use")
  .option(
    "-p, --path <path>",
    "apply a derivation path to the key before deriving addresses"
  )
  .option(
    "-c, --count <num>",
    "the number of each address type to encode, this will cause an additional index to be derived from the key for each address"
  )
  .addOption(
    new Option("-t, --type <type>", "the type of address to encode")
      .choices(["p2pkh", "p2sh-p2wpkh", "p2wpkh", "p2tr"])
      .default("p2wpkh")
  )
  .parse(process.argv);

const options = program.opts();

const keyNetworks = getNetworksForExtendedKey(options.key);
let key = bip32.fromBase58(options.key, keyNetworks.current);
const num = options.count;

if (options.path) {
  options.path = options.path.replace(/h/g, "'");
  console.log("Using path: " + options.path);
  key = key.derivePath(options.path);
  console.log("Derived key: " + key.toBase58());
}

if (options.count) {
  options.count = Number(options.count);
  if (isNaN(options.count) || options.count < 1) {
    throw new Error("Invalid number of addresses");
  }
}

let address;
switch (options.type) {
  case "p2pkh":
    if (options.count) {
      for (let i = 0; i < num; i++) {
        const child = key.derive(i);
        const { address } = bitcoin.payments.p2pkh({
          pubkey: child.publicKey,
          network: child.network,
        });
        console.log(`p2pkh address /${i}: ${address}`);
      }
    } else {
      const { address } = bitcoin.payments.p2pkh({
        pubkey: key.publicKey,
        network: key.network,
      });
      console.log(`p2pkh address: ${address}`);
    }

    break;

  case "p2sh-p2wpkh":
    if (options.count) {
      for (let i = 0; i < num; i++) {
        const child = key.derive(i);
        const { address } = bitcoin.payments.p2sh({
          redeem: bitcoin.payments.p2wpkh({
            pubkey: child.publicKey,
            network: child.network,
          }),
          network: child.network,
        });
        console.log(`p2sh-p2wpkh address /${i}: ${address}`);
      }
    } else {
      const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({
          pubkey: key.publicKey,
          network: key.network,
        }),
        network: key.network,
      });
      console.log(`p2sh-p2wpkh address: ${address}`);
    }

    break;
  case "p2wpkh":
    if (options.count) {
      for (let i = 0; i < num; i++) {
        const child = key.derive(i);
        const { address } = bitcoin.payments.p2wpkh({
          pubkey: child.publicKey,
          network: child.network,
        });
        console.log(`p2wpkh address /${i}: ${address}`);
      }
    } else {
      const { address } = bitcoin.payments.p2wpkh({
        pubkey: key.publicKey,
        network: key.network,
      });
      console.log(`p2wpkh address: ${address}`);
    }

    break;

  case "p2tr":
    if (options.count) {
      for (let i = 0; i < num; i++) {
        const child = key.derive(i);
        const { address } = bitcoin.payments.p2tr({
          internalPubkey: toXOnly(child.publicKey),
          network: child.network,
        });
        console.log(`p2tr address /${i}: ${address}`);
      }
    } else {
      const { address } = bitcoin.payments.p2tr({
        internalPubkey: toXOnly(key.publicKey),
        network: key.network,
      });
      console.log(`p2tr address: ${address}`);
    }

    break;
  default:
    console.error("Unsupported address type");
    process.exit(1);
}
