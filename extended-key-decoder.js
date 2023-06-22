const { Command } = require('commander');
const program = new Command();
const bitcoin = require('bitcoinjs-lib')
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bip32 = BIP32Factory(ecc);

program
  .requiredOption('-k, --key <key>', 'the extended key to decode')
  .parse(process.argv);

const options = program.opts();

testnetChars = [ 't', 'u', 'v', 'U', 'V' ];

let network = bitcoin.networks.bitcoin;
if (testnetChars.includes(options.key[0])) {
  network = bitcoin.networks.testnet;
}
const b32Key = bip32.fromBase58(options.key, network);

if (b32Key.privateKey) {
  console.log('version     :', b32Key.network.bip32.private.toString(16).padStart(10, '0x0'));
}
else {
  console.log('version     :', b32Key.network.bip32.public.toString(16).padStart(10, '0x0'));
}

console.log('depth       :', b32Key.depth);
console.log('index       :', b32Key.index);
console.log('fingerprint :', '0x'.concat(Buffer.from(b32Key.fingerprint).toString('hex')));

if (b32Key.privateKey) {
  console.log('private key :', '0x'.concat(Buffer.from(b32Key.privateKey).toString('hex')));
  console.log('            :', b32Key.privateKey);
}
else {
  console.log('public key  :', '0x'.concat(Buffer.from(b32Key.publicKey).toString('hex')));
  console.log('            :', b32Key.publicKey);
}

console.log('chain code  :', '0x'.concat(Buffer.from(b32Key.chainCode).toString('hex')));
console.log('            :', b32Key.chainCode);