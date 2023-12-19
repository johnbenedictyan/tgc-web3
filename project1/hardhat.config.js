require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");

const INFURA_API_KEY = "KEY";
const SEPOLIA_PRIVATE_KEY = "YOUR SEPOLIA PRIVATE KEY";
// https://www.infura.io/
// https://www.infura.io/faucet/sepolia

// npx hardhat ignition deploy ignition/modules/Apollo.js --network localhost
// npx hardhat ignition deploy ignition/modules/Apollo.js --network sepolia

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
