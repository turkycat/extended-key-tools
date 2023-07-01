const { Command } = require('commander');
const program = new Command();
const bitcoin = require('bitcoinjs-lib')
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const { BIP32Path } = require('bitcoinjs-lib/src/types');
const bip32 = BIP32Factory(ecc);

program
  .requiredOption('-k, --key <key>', 'the extended key to derive')
  .option('-p, --path <path>', 'the derivation path to use')
  .parse(process.argv);

const options = program.opts();

testnetChars = [ 't', 'u', 'v', 'U', 'V' ];

let network = bitcoin.networks.bitcoin;
if (testnetChars.includes(options.key[0])) {
  network = bitcoin.networks.testnet;
}

// create a master key and encode it for main and testnet
const master = bip32.fromBase58(options.key, network);

if (options.path) {
  options.path = options.path.replace(/h/g, '\'');
  console.log('Using path: ' + options.path);
}
else {
  console.log("Using default path for testnet p2wsh: m/48'/1'/0'/2'");
  options.path = "m/48'/1'/0'/2'";
}

let derived = master.derivePath(options.path)

derived.network = bitcoin.networks.bitcoin;
const main = { xprv: derived.toBase58(), xpub: derived.neutered().toBase58() };
derived.network = bitcoin.networks.testnet;
const test = { tprv: derived.toBase58(), tpub: derived.neutered().toBase58() };

console.log({
  origin: master.fingerprint.toString('hex'),
  fingerprint: derived.fingerprint.toString('hex'),
  depth: derived.depth,
  index: derived.index,
  main,
  test
})