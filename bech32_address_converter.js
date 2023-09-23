// tb1q6g0mhnwcssfulc39as04k4xazaxt2s6eg0q6yj4uylzzcfy73n3sr7ah55

const { Command } = require('commander');
const program = new Command();
const bitcoin = require('bitcoinjs-lib')
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const { BIP32Path } = require('bitcoinjs-lib/src/types');
const bip32 = BIP32Factory(ecc);

program
  .addHelpText('before', 'converts a given bech32 address between networks.')
  .requiredOption('-a, --address <address>', 'the beck32 address path to convert')
  .requiredOption('-n, --network <network>', 'the network to convert to, valid values are \'mainnet\', \'testnet\', and \'regtest\'')
  .parse(process.argv);

const options = program.opts();

if (!(options.network === 'mainnet' ||
    options.network === 'testnet' ||
    options.network === 'regtest')) {
      throw new Error("invalid network, valid values are 'mainnet', 'testnet', and 'regtest'");
}

// Network parameters
let sourceNetwork = bitcoin.networks.bitcoin;
if (options.address.startsWith('tb1')) {
  sourceNetwork = bitcoin.networks.testnet;
}
else if (options.address.startsWith('bcrt1')) {
  sourceNetwork = bitcoin.networks.regtest;
}

let prefix = "bc";
if (options.network === 'testnet') {
  prefix = "tb";
}
else if (options.network === 'regtest') {
  prefix = "bcrt";
}

// Decode the address from the source network
const decoded = bitcoin.address.fromBech32(options.address);
console.log('given address, decoded:', decoded);

// Convert the decoded address to the destination network
// only works for segwit lol (version 0)
const converted = bitcoin.address.toBech32(decoded.data, 0, prefix);//destinationNetwork.pubKeyHash);

// Output the converted address
console.log(`converted address to ${options.network}:`, converted);
