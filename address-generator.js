const { Command, Option } = require("commander");
const program = new Command();
const bitcoin = require("bitcoinjs-lib");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const bip32 = BIP32Factory(ecc);
const { getNetworksForExtendedKey } = require("./networks");

const DEFAULT_PATH = "m/48'/1'/0'/2'";

program
  .addHelpText("before", "derives an extended key with a given path.")
  .requiredOption("-k, --key <key>", "the extended key to use")
  .addOption(
    new Option(
      "-n, --num <num>",
      "the number of each address type to generate"
    ).default(3)
  )
  .parse(process.argv);

const options = program.opts();

const keyNetworks = getNetworksForExtendedKey(options.key);
const key = bip32.fromBase58(options.key, keyNetworks.current);
const num = options.num;

for (let i = 0; i < num; i++) {
  const child = key.derive(i);
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
    network: key.network,
  });
  console.log(`p2wpkh address /${i}: ${address}`);
}

for (let i = 0; i < num; i++) {
  const child = key.derive(i);
  const { address } = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
    network: key.network,
  });
  console.log(`p2pkh address /${i}: ${address}`);
}

for (let i = 0; i < num; i++) {
  const child = key.derive(i);
  const { address } = bitcoin.payments.p2wsh({
    redeem: bitcoin.payments.p2ms({
      m: 1,
      pubkeys: [child.publicKey],
      network: key.network,
    }),
    network: key.network,
  });
  console.log(`p2wsh address /${i}: ${address}`);
}

for (let i = 0; i < num; i++) {
  const child = key.derive(i);
  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: key.network,
    }),
    network: key.network,
  });
  console.log(`p2sh-p2wpkh address /${i}: ${address}`);
}
