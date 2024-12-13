const { Option, Command } = require("commander");
const program = new Command();
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const {networks} = require('./networks');

program
  .addHelpText("before", "converts a given address between networks.")
  .requiredOption("-a, --address <address>", "the address to convert")
  .addOption(
    new Option("-n, --network <network>", "the network to convert to").choices([
      "mainnet",
      "bitcoin",
      "testnet",
      "regtest",
    ])
  )
  .parse(process.argv);

const options = program.opts();

const convertBech32 = (address, targetNetwork) => {
  const decoded = bitcoin.address.fromBech32(address);
  const { data } = decoded;
  const newAddress = bitcoin.address.toBech32(
    data,
    decoded.version,
    targetNetwork.bech32
  );
  return newAddress;
};

const convertBase58 = (address, targetNetwork) => {
  const decoded = bitcoin.address.fromBase58Check(address);
  const { hash } = decoded;
  const newAddress = bitcoin.address.toBase58Check(
    hash,
    targetNetwork.pubKeyHash
  );
  return newAddress;
};

const targetNetwork = networks[options.network];

let converted;
if (/^bc/.test(options.address)) {
  converted = convertBech32(options.address, targetNetwork);
} else {
  converted = convertBase58(options.address, targetNetwork);
}

console.log(converted);
