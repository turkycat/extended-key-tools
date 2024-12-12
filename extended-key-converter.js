const { Command } = require("commander");
const program = new Command();
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const {getNetworksForExtendedKey} = require('./networks');

program
  .addHelpText(
    "before",
    "converts a given extended key between networks or from private to public."
  )
  .requiredOption("-k, --key <key>", "the extended key to convert")
  .option("-p, --public", "convert extended private key to public key")
  .parse(process.argv);

const options = program.opts();

const networks = getNetworksForExtendedKey(options.key);
const b32Key = bip32.fromBase58(options.key, networks.current);
const convertToNetwork = networks.current === networks.mainnet ? networks.testnet : networks.mainnet;

if (options.public) {
  if (!b32Key.privateKey) {
    console.log("given key is already public");
    process.exit(1);
  }

  console.log(b32Key.neutered().toBase58());
  process.exit(0);
}

b32Key.network = convertToNetwork;
console.log(b32Key.toBase58());
