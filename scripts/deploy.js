const hre = require("hardhat");
require("dotenv").config();

async function main() {
  try {
    console.log("Starting deployment...");

    // Get deployment parameters
    const subscriptionId = process.env.SUBSCRIPTION_ID;
    const vrfCoordinator = process.env.VRF_COORDINATOR;
    const keyHash = process.env.KEY_HASH;

    // Validate parameters
    if (!subscriptionId || !vrfCoordinator || !keyHash) {
      throw new Error("Missing environment variables");
    }

    // Convert subscription ID to the correct format
    let formattedSubId;
    try {
      const bigNumSubId = hre.ethers.BigNumber.from(subscriptionId);
      formattedSubId = bigNumSubId.mod(hre.ethers.BigNumber.from("18446744073709551616")); // 2^64
      console.log("Formatted Subscription ID:", formattedSubId.toString());
    } catch (error) {
      console.error("Error formatting subscription ID:", error);
      process.exit(1);
    }

    console.log("\nDeployment Parameters:");
    console.log("Original Subscription ID:", subscriptionId);
    console.log("Formatted Subscription ID:", formattedSubId.toString());
    console.log("VRF Coordinator:", vrfCoordinator);
    console.log("Key Hash:", keyHash);

    // Deploy contract
    console.log("\nDeploying RandomNumberGenerator...");
    const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
    
    const randomNumberGenerator = await RandomNumberGenerator.deploy(
      formattedSubId,
      vrfCoordinator,
      keyHash
    );

    await randomNumberGenerator.deployed();

    console.log("\n✅ Contract deployed successfully!");
    console.log(`Contract address: ${randomNumberGenerator.address}`);

    // Print verification and usage instructions
    console.log("\n📝 Verification command:");
    console.log(`npx hardhat verify --network mumbai \\`);
    console.log(`  ${randomNumberGenerator.address} \\`);
    console.log(`  ${formattedSubId.toString()} \\`);
    console.log(`  ${vrfCoordinator} \\`);
    console.log(`  ${keyHash}`);

    console.log("\n🔍 Next steps:");
    console.log("1. Add the contract address as a consumer in your Chainlink VRF subscription");
    console.log("2. Ensure your subscription has enough LINK tokens");
    console.log("3. Call requestRandomNumber() to get a random number");
    console.log("4. Use getLastRandomNumber() to retrieve the generated number (1-100)");

  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


























  












// const hre = require("hardhat");
// require("dotenv").config();

// async function main() {
//   try {
//     console.log("Deploying RandomNumberGenerator...");

//     // Convert the full subscription ID to a uint64 by taking the last 16 characters
//     const fullSubId = process.env.SUBSCRIPTION_ID;
//     const last16Chars = fullSubId.slice(-16); // Take last 16 characters
//     const subscriptionId = parseInt(last16Chars, 16); // Convert to decimal

//     const vrfCoordinator = process.env.VRF_COORDINATOR;
//     const keyHash = process.env.KEY_HASH;

//     console.log("Deployment Parameters:");
//     console.log("Subscription ID (truncated):", subscriptionId);
//     console.log("VRF Coordinator:", vrfCoordinator);
//     console.log("Key Hash:", keyHash);

//     if (!subscriptionId || !vrfCoordinator || !keyHash) {
//       throw new Error("Required environment variables are not set");
//     }

//     const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
    
//     console.log("Deploying contract...");
//     const randomNumberGenerator = await RandomNumberGenerator.deploy(
//       subscriptionId,
//       vrfCoordinator,
//       keyHash
//     );

//     await randomNumberGenerator.deployed();

//     console.log("✅ Contract deployed successfully!");
//     console.log(`Contract address: ${randomNumberGenerator.address}`);
    
//     // Verification command
//     console.log("\nTo verify on Etherscan, run:");
//     console.log(`npx hardhat verify --network mumbai ${randomNumberGenerator.address} ${subscriptionId} ${vrfCoordinator} ${keyHash}`);

//   } catch (error) {
//     console.error("❌ Deployment failed:");
//     console.error(error);
//     process.exit(1);
//   }
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });