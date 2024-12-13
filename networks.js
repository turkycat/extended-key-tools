const bitcoin = require("bitcoinjs-lib");

const networks = {
  mainnet: bitcoin.networks.bitcoin,
  bitcoin: bitcoin.networks.bitcoin,
  testnet: bitcoin.networks.testnet,
  regtest: bitcoin.networks.regtest,
  mainnetYpub: {
    ...bitcoin.networks.bitcoin,
    bip32: {
      public: 0x049d7cb2, // ypub
      private: 0x049d7878, // yprv
    },
  },
  testnetYpub: {
    ...bitcoin.networks.testnet,
    bip32: {
      public: 0x044a5262, // upub
      private: 0x044a4e28, // uprv
    },
  },
  mainnetZpub: {
    ...bitcoin.networks.bitcoin,
    bip32: {
      public: 0x04b24746, // zpub
      private: 0x04b2430c, // zprv
    },
  },
  testnetZpub: {
    ...bitcoin.networks.testnet,
    bip32: {
      public: 0x045f1cf6, // vpub
      private: 0x045f18bc, // vprv
    },
  },
};

const testnetChars = ["t", "u", "U", "v", "V"];
const ypubChars = ["Y", "y", "u", "U",];
const zpubChars = ["Z", "z", "v", "V"];

const getNetworksForExtendedKey = (key) => {
  let mainnet = networks.mainnet;
  let testnet = networks.testnet;
  if (ypubChars.includes(key[0])) {
    mainnet = networks.mainnetYpub;
    testnet = networks.testnetYpub;
  } else if (zpubChars.includes(key[0])) {
    mainnet = networks.mainnetZpub;
    testnet = networks.testnetZpub;
  }

  let current = mainnet;
  if (testnetChars.includes(key[0])) {
    current = testnet;
  }

  return { current, mainnet, testnet };
};

module.exports = { networks, getNetworksForExtendedKey };
