const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Get the contract instance
  const contractAddress = process.env.RANDOM_NUMBER_GENERATOR_ADDRESS;
  if (!contractAddress) {
    throw new Error("Contract address not set in .env");
  }

  const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
  const contract = RandomNumberGenerator.attach(contractAddress);

  console.log("Requesting random number...");
  
  // Request random number
  const tx = await contract.requestRandomNumber();
  console.log("Transaction hash:", tx.hash);
  
  // Wait for transaction to be mined
  await tx.wait();
  console.log("Request submitted successfully");

  // Set up event listener for NumberGenerated event
  contract.on("NumberGenerated", async (randomNumber) => {
    console.log("Random number generated:", randomNumber.toString());
    process.exit(0);
  });

  console.log("Waiting for random number generation (this may take a few minutes)...");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});