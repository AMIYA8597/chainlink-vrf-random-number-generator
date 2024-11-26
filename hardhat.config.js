require("@nomicfoundation/hardhat-toolbox");
// import "@nomiclabs/hardhat-ethers";
// import { task } from "hardhat/config";
require("dotenv").config();


module.exports = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};


// export default {
//   solidity: "0.8.7",
// };