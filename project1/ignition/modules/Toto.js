const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Toto", (m) => {
  const Toto = m.contract("Lottery");

  return { Toto };
});
