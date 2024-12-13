const translateIndex = (value) => {
  const hardened = (value & (1 << 31)) !== 0;
  const index = String(value & 0x7fffffff).concat(hardened ? "'" : "");
  return { hardened, index, value };
};

module.exports = {translateIndex}