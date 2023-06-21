const { Command } = require('commander');
const program = new Command();
const bitcoin = require('bitcoinjs-lib')
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const { BIP32Path } = require('bitcoinjs-lib/src/types');
const bip32 = BIP32Factory(ecc);

program
    .option('-p, --path <path>', 'the derivation path to use')
    .parse(process.argv);

const options = program.opts();

// Generate a random seed (not secure)
const seed = bitcoin.crypto.sha256(Math.random().toString());

// create a master key and encode it for main and testnet
const master = bip32.fromSeed(seed, bitcoin.networks.mainnet);

if (options.path) {
    console.log('Using path: ' + options.path);
}
else {
    console.log("Using default path for testnet p2wsh: m/48'/1'/0'/2'");
    options.path = "m/48'/1'/0'/2'";
}

let derived = master.derivePath(options.path)

const xkeys = { xprv: derived.toBase58(), xpub: derived.neutered().toBase58() };
derived.network = bitcoin.networks.testnet;
const tkeys = { tprv: derived.toBase58(), tpub: derived.neutered().toBase58() };

console.log({
    fingerprint: derived.fingerprint.toString('hex'),
    depth: derived.depth,
    index: derived.index,
    xkeys,
    tkeys
})