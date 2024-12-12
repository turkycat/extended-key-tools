const { Command } = require('commander');
const program = new Command();
const bitcoin = require('bitcoinjs-lib')
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const { BIP32Path } = require('bitcoinjs-lib/src/types');
const bip32 = BIP32Factory(ecc);
const {getNetworksForExtendedKey} = require('./networks');

const DEFAULT_PATH = "m/48'/1'/0'/2'"

program
  .addHelpText('before', 'derives an extended key with a given path.')
  .requiredOption('-k, --key <key>', 'the extended key to derive')
  .option('-p, --path <path>', `the derivation path to use. use h or ' for hardened derivations. default: ${DEFAULT_PATH}`)
  .option('-g, --generate-addresses', 'generate some addresses')
  .parse(process.argv);

const options = program.opts();

const networks = getNetworksForExtendedKey(options.key);
const master = bip32.fromBase58(options.key, networks.current);

if (options.path) {
  options.path = options.path.replace(/h/g, '\'');
  console.log('Using path: ' + options.path);
}
else {
  console.log(`Using default path for testnet p2wsh: ${DEFAULT_PATH}`);
  options.path = DEFAULT_PATH;
}

master.network = networks.mainnet;
let derived = master.derivePath(options.path)
const main = { xprv: derived.toBase58(), xpub: derived.neutered().toBase58() };
const derivedAsTestnet = bip32.fromBase58(derived.toBase58(), networks.mainnet);
derivedAsTestnet.network = networks.testnet;
const test = { tprv: derivedAsTestnet.toBase58(), tpub: derivedAsTestnet.neutered().toBase58() };

console.log({
  origin: master.fingerprint.toString('hex'),
  fingerprint: derived.fingerprint.toString('hex'),
  depth: derived.depth,
  index: derived.index,
  main,
  test
})

if (options.generateAddresses) {
  for (let i = 0; i < 3; i++) {
    const child = derived.derive(i);
    const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network: derived.network });
    console.log(`p2wpkh address /${i}: ${address}`);
  }
  for (let i = 0; i < 3; i++) {
    const child = derived.derive(i);
    const { address } = bitcoin.payments.p2sh({ redeem: bitcoin.payments.p2ms({
      m: 1,
      pubkeys: [child.publicKey],
      network: derived.network,
    }), network: derived.network });
    console.log(`p2sh-p2wpkh address /${i}: ${address}`);
  }
}