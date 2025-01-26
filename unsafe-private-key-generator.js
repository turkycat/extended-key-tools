#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const crypto = require("crypto");
const bitcoin = require("bitcoinjs-lib");

const DEFAULT_BYTE_LENGTH = 16;

program
  .addHelpText("before", "generates a 256-bit private key using sha256.")
  .addHelpText(
    "after",
    "\nWARNING: this tool is for educational  purposes only. Do not secure real funds with these keys."
  )
  .option(
    "-l, --length <length>",
    `the length of data to generate, in bytes: ${DEFAULT_BYTE_LENGTH}`
  )
  .option(
    "-e, --entropy <entropy>",
    `the hex-encoded entropy data to use instead of generating new random data.`
  )
  .parse(process.argv);

const options = program.opts();
if (options.entropy && options.length) {
  console.error("Cannot specify both entropy and length");
  process.exit(1);
}

let data;
if (options.entropy) {
  data = Buffer.from(options.entropy, "hex");
  console.log("using provided entropy :", data.toString("hex"));
} else {
  // the use of the crypto library is better than a conventional random number generator
  // but you should never use this to secure real funds. This is for educational purposes only.
  const length = options.length || DEFAULT_BYTE_LENGTH;
  data = crypto.randomBytes(length);
  console.log("generated new entropy  :", data.toString("hex"));
}

// note that we're hashing the data in binary form, even though the conventional
// format for representing binary data to human readers is in hex
// here two different ways to accomplish the same thing
const privateKey = crypto.createHash("sha256").update(data).digest("hex");
// const privateKey = bitcoin.crypto.sha256(data).toString("hex");
console.log("private key            :", privateKey);
