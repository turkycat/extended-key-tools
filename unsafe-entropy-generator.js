#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const crypto = require("crypto");

const DEFAULT_BYTE_LENGTH = 16;

program
  .addHelpText("before", "generates a hex-encoded string of random data.")
  .addHelpText(
    "after",
    "\nWARNING: this tool is for educational  purposes only. Do not secure real funds with these keys."
  )
  .option(
    "-l, --length <length>",
    `the length of entropy data to generate, in bytes: ${DEFAULT_BYTE_LENGTH}`
  )
  .parse(process.argv);

const options = program.opts();
const length = options.length || DEFAULT_BYTE_LENGTH;

// the use of the crypto library is better than a conventional random number generator
// but you should never use this to secure real funds. This is for educational purposes only.
const data = crypto.randomBytes(length).toString("hex");
console.log("generated new entropy  :", data);
