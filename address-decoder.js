const { Option, Command } = require("commander");
const program = new Command();
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const { networks } = require("./networks");

program
  .addHelpText("before", "converts a given address between networks.")
  .requiredOption("-a, --address <address>", "the address to decode")
  .parse(process.argv);

const options = program.opts();

if (/^(bc|tb)/.test(options.address)) {
  const decoded = bitcoin.address.fromBech32(options.address);
  console.log("version     :", decoded.version);
  console.log("prefix      :", decoded.prefix);
  console.log(
    "data        :",
    "0x".concat(Buffer.from(decoded.data).toString("hex"))
  );
} else {
  const decoded = bitcoin.address.fromBase58Check(options.address);
  console.log("version     :", decoded.version);
  console.log(
    "data        :",
    "0x".concat(Buffer.from(decoded.hash).toString("hex"))
  );
}
