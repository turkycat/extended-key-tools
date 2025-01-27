#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();

program
  .addHelpText("before", "calculates the checksum for a given descriptor.")
  .option(
    "-d, --descriptor <descriptor>",
    "the descriptor to calculate checksum for, as is."
  )
  .parse(process.argv);

const options = program.opts();

const INPUT_CHARSET =
  "0123456789()[],'/*abcdefgh@:$%{}IJKLMNOPQRSTUVWXYZ&+-.;<=>?!^_|~ijklmnopqrstuvwxyzABCDEFGH`#\"\\ ";
const CHECKSUM_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const GENERATOR = [
  0xf5dee51989n,
  0xa9fdca3312n,
  0x1bab10e32dn,
  0x3706b1677an,
  0x644d626ffdn,
];

function descsum_polymod(symbols) {
  let chk = 1n;
  for (const value of symbols) {
    const top = chk >> 35n;
    chk = ((chk & 0x7ffffffffn) << 5n) ^ BigInt(value);
    for (let i = 0; i < 5; i++) {
      chk ^= GENERATOR[i] & ((top >> BigInt(i)) & 1n ? -1n : 0n);
    }
  }
  return chk;
}

function descsum_expand(s) {
  const groups = [];
  const symbols = [];
  for (const c of s) {
    const idx = INPUT_CHARSET.indexOf(c);
    if (idx === -1) {
      return null;
    }
    const v = idx & 31;
    symbols.push(v);
    groups.push(idx >> 5);
    if (groups.length === 3) {
      symbols.push(groups[0] * 9 + groups[1] * 3 + groups[2]);
      groups.length = 0;
    }
  }
  if (groups.length === 1) {
    symbols.push(groups[0]);
  } else if (groups.length === 2) {
    symbols.push(groups[0] * 3 + groups[1]);
  }
  return symbols;
}

function descsum_create(s) {
  const symbols = descsum_expand(s);
  symbols.push(0, 0, 0, 0, 0, 0, 0, 0);
  const checksum = descsum_polymod(symbols) ^ 1n;
  const checksum_chars = new Array(8);
  for (let i = 0; i < 8; i++) {
    checksum_chars[i] =
      CHECKSUM_CHARSET[Number(checksum >> (5n * BigInt(7 - i))) & 31];
  }
  return "#" + checksum_chars.join("");
}

const checksum = descsum_create(options.descriptor);
console.log();
console.log("checksum       : ", checksum);
console.log("full descriptor: ", options.descriptor + checksum);
