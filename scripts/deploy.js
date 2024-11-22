const { BN } = require("bn.js");
const hre = require("hardhat");
require("dotenv").config();

async function main() {
try {
  console.log("Deploying RandomNumberGenerator...");

  const subscriptionId = hre.ethers.BigNumber.from(process.env.SUBSCRIPTION_ID).toNumber();
  console.log("subscriptionid" , subscriptionId)
  const vrfCoordinator = process.env.VRF_COORDINATOR;
  const keyHash = process.env.KEY_HASH;

  if (!subscriptionId || !vrfCoordinator || !keyHash) {
    throw new Error("Required environment variables are not set");
  }

  console.log("asjdansdk")
  const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
  const randomNumberGenerator = await RandomNumberGenerator.deploy(
   subscriptionId.value,
    vrfCoordinator,
    keyHash
  );

  await randomNumberGenerator.deployed();

  console.log(
    `RandomNumberGenerator deployed to ${randomNumberGenerator.address}`
  );
} catch (error) {
  console.log(error )
}
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});