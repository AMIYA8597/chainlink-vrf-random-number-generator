const hre = require("hardhat");

async function main() {
    // Get actual subscription ID from VRF Coordinator
    const subscriptionId = process.env.SUBSCRIPTION_ID; // Replace with your subscription ID from VRF.chain.link

    console.log("Deploying JackVRFNumberGenerator...");
    const JackVRFNumberGenerator = await hre.ethers.getContractFactory("JackVRFNumberGenerator");
    const generator = await JackVRFNumberGenerator.deploy(subscriptionId);

    await generator.deployed();

    console.log("JackVRFNumberGenerator deployed to:", generator.address);
    console.log("Subscription ID:", subscriptionId);
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
//     console.log("Starting deployment...");

//     // Get deployment parameters
//     const subscriptionId = process.env.SUBSCRIPTION_ID;
//     const vrfCoordinator = process.env.VRF_COORDINATOR;
//     const keyHash = process.env.KEY_HASH;

//     // Validate parameters
//     if (!subscriptionId || !vrfCoordinator || !keyHash) {
//       throw new Error("Missing environment variables");
//     }

//     // Convert subscription ID to the correct format
//     let formattedSubId;
//     try {
//       const bigNumSubId = hre.ethers.BigNumber.from(subscriptionId);
//       formattedSubId = bigNumSubId.mod(hre.ethers.BigNumber.from("18446744073709551616")); // 2^64
//       console.log("Formatted Subscription ID:", formattedSubId.toString());
//     } catch (error) {
//       console.error("Error formatting subscription ID:", error);
//       process.exit(1);
//     }

//     console.log("\nDeployment Parameters:");
//     console.log("Original Subscription ID:", subscriptionId);
//     console.log("Formatted Subscription ID:", formattedSubId.toString());
//     console.log("VRF Coordinator:", vrfCoordinator);
//     console.log("Key Hash:", keyHash);

//     // Deploy contract
//     console.log("\nDeploying RandomNumberGenerator...");
//     const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
    
//     const randomNumberGenerator = await RandomNumberGenerator.deploy(
//       formattedSubId,
//       vrfCoordinator,
//       keyHash
//     );

//     await randomNumberGenerator.deployed();

//     console.log("\n✅ Contract deployed successfully!");
//     console.log(`Contract address: ${randomNumberGenerator.address}`);

//   } catch (error) {
//     console.error("\n❌ Deployment failed:");
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





























































































// const hre = require("hardhat");
// require("dotenv").config();
// const { ethers } = hre; // Import ethers from hre
// const { parseUnits } = ethers.utils; // Import parseUnits for unit conversion

// // Import the IERC20 interface
// const IERC20 = require('@openzeppelin/contracts/token/ERC20/IERC20.sol');

// async function main() {
//   try {
//     console.log("Starting deployment...");

//     // Get deployment parameters
//     const subscriptionId = process.env.SUBSCRIPTION_ID;
//     const vrfCoordinator = process.env.VRF_COORDINATOR;
//     const keyHash = process.env.KEY_HASH;

//     // Validate parameters
//     if (!subscriptionId || !vrfCoordinator || !keyHash) {
//       throw new Error("Missing environment variables");
//     }

//     // Convert subscription ID to the correct format
//     let formattedSubId;
//     try {
//       const bigNumSubId = ethers.BigNumber.from(subscriptionId);
//       formattedSubId = bigNumSubId.mod(ethers.BigNumber.from("18446744073709551616")); // 2^64
//       console.log("Formatted Subscription ID:", formattedSubId.toString());
//     } catch (error) {
//       console.error("Error formatting subscription ID:", error);
//       process.exit(1);
//     }

//     console.log("\nDeployment Parameters:");
//     console.log("Original Subscription ID:", subscriptionId);
//     console.log("Formatted Subscription ID:", formattedSubId.toString());
//     console.log("VRF Coordinator:", vrfCoordinator);
//     console.log("Key Hash:", keyHash);

//     // Deploy contract
//     console.log("\nDeploying RandomNumberGenerator...");
//     const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
    
//     const randomNumberGenerator = await RandomNumberGenerator.deploy(
//       formattedSubId,
//       vrfCoordinator,
//       keyHash
//     );

//     await randomNumberGenerator.deployed();

//     console.log("\n✅ Contract deployed successfully!");
//     console.log(`Contract address: ${randomNumberGenerator.address}`);

//     // Check LINK balance of the contract to ensure it's funded
//     const linkTokenAddress = process.env.LINK_TOKEN_ADDRESS; // Add LINK token address to your .env
//     const linkToken = await ethers.getContractAt(IERC20.interface, linkTokenAddress);
    
//     const linkBalance = await linkToken.balanceOf(randomNumberGenerator.address);
//     console.log("Contract LINK Balance:", ethers.utils.formatUnits(linkBalance, 18), "LINK");

//     const fee = parseUnits("0.1", 18); // The fee amount in LINK

//     if (linkBalance.lt(fee)) {
//       throw new Error("Not enough LINK tokens in contract to make a request.");
//     }

//     // Request random number
//     console.log("Requesting random number...");
//     let tx = await randomNumberGenerator.getRandomNumber();
//     await tx.wait(); // Wait for the transaction to be mined

//     console.log("Random number requested. Transaction hash:", tx.hash);

//   } catch (error) {
//     console.error("\n❌ Deployment failed:");
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
