const { Command, Option } = require("commander");
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);

const program = new Command();

program
  .addHelpText("before", "encodes a given public key into an address.")
  .requiredOption("-p, --public-key <publicKey>", "the public key to encode")
  .addOption(
    new Option("-t, --type <type>", "the type of address to encode")
      .choices(["p2pkh", "p2sh-p2wpkh", "p2wpkh"])
      .default("p2wpkh")
  )
  .addOption(
    new Option("-n, --network <network>", "the network to encode for")
      .choices(["mainnet", "bitcoin", "testnet", "regtest"])
      .default("testnet")
  )
  .parse(process.argv);

const options = program.opts();
const publicKey = Buffer.from(options.publicKey, "hex");

let address;
switch (options.type) {
  case "p2pkh":
    address = bitcoin.payments.p2pkh({ pubkey: publicKey }).address;
    break;
  case "p2sh-p2wpkh":
    address = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({ pubkey: publicKey }),
    }).address;
    break;
  case "p2wpkh":
    address = bitcoin.payments.p2wpkh({ pubkey: publicKey }).address;
    break;
  default:
    console.error("Unsupported address type");
    process.exit(1);
}

console.log(address);
