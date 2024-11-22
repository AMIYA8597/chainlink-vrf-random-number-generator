const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Deploying RandomNumberGenerator...");

  const subscriptionId = process.env.SUBSCRIPTION_ID;
  const vrfCoordinator = process.env.VRF_COORDINATOR;
  const keyHash = process.env.KEY_HASH;

  if (!subscriptionId || !vrfCoordinator || !keyHash) {
    throw new Error("Required environment variables are not set");
  }

  const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
  const randomNumberGenerator = await RandomNumberGenerator.deploy(
    subscriptionId,
    vrfCoordinator,
    keyHash
  );

  await randomNumberGenerator.deployed();

  console.log(
    `RandomNumberGenerator deployed to ${randomNumberGenerator.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});