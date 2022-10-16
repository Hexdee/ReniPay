require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${process.env.APP_ID}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
  apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY
    }
  },
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
}
