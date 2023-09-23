const { Command } = require('commander');
const program = new Command();
const bitcoin = require('bitcoinjs-lib')
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bip32 = BIP32Factory(ecc);

program
  .addHelpText('before', 'decodes a raw serialized transaction and prints some basic info')
  .requiredOption('-h, --transactionHex <transactionHex>', 'the serialized transaction to decode')
  .parse(process.argv);

const options = program.opts();

const transaction = bitcoin.Transaction.fromHex(options.transactionHex)
const vsize = transaction.virtualSize()
const fee = transaction.outs.reduce((a, x) => a + x.value, 0) - transaction.ins.reduce((a, x) => a + x.value, 0)
const value = transaction.ins.reduce((a, x) => a + x.value, 0)

console.log(transaction)
console.log(vsize)
console.log(fee)
console.log(value)