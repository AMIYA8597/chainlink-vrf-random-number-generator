# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
# chainlink-vrf-random-number-generator



run this code ->  




# Install dependencies
npm install

# Clean hardhat cache and artifacts
npx hardhat clean

# Compile contracts
npx hardhat compile

# Deploy contract
npx hardhat run scripts/deploy.js --network sepolia

npx hardhat run scripts/request-random-number.js --network sepolia