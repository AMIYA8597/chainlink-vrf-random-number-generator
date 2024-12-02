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





















































































// const hre = require("hardhat");
// require("dotenv").config();

// async function main() {
//   try {
//     console.log("Starting deployment...");

//     // Sepolia VRF Coordinator: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
//     // Sepolia Key Hash: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c
    
//     const subscriptionId = process.env.SUBSCRIPTION_ID;
//     const vrfCoordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
//     const keyHash = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";

//     if (!subscriptionId) {
//         throw new Error("Missing SUBSCRIPTION_ID in environment variables");
//     }

//     console.log("Deployment Parameters:");
//     console.log("Subscription ID:", subscriptionId);
//     console.log("VRF Coordinator:", vrfCoordinator);
//     console.log("Key Hash:", keyHash);

//     const [deployer] = await hre.ethers.getSigners();
//     console.log("Deploying with account:", deployer.address);

//     const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
//     console.log("Deploying RandomNumberGenerator...");

//     const randomNumberGenerator = await RandomNumberGenerator.deploy(
//         subscriptionId,
//         vrfCoordinator,
//         keyHash
//     );

//     await randomNumberGenerator.deployed();

    

//     console.log("Contract deployed to:", randomNumberGenerator.address);
    
//     // Wait for a few block confirmations
//     console.log("Waiting for confirmations...");
//     await new Promise(resolve => setTimeout(resolve, 30000));

//     // Verify the contract
//     try {
//         await hre.run("verify:verify", {
//             address: randomNumberGenerator.address,
//             constructorArguments: [
//                 subscriptionId,
//                 vrfCoordinator,
//                 keyHash
//             ],
//         });
//         console.log("Contract verified on Etherscan");
//     } catch (error) {
//         console.log("Verification error:", error);
//     }

//     // Check subscription
//     const subId = await randomNumberGenerator.checkSubscription();
//     console.log("Confirmed Subscription ID:", subId.toString());

//   } catch (error) {
//     console.error("Deployment failed:", error);
//     process.exit(1);
//   }
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });


















// const hre = require("hardhat");
// require("dotenv").config();

// async function main() {
//   try {
//     console.log("Starting deployment...");

//     // Get deployment parameters
//     const subscriptionId = process.env.SUBSCRIPTION_ID;
//     const vrfCoordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625"; // Sepolia VRF Coordinator
//     const keyHash = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c"; // Sepolia key hash

//     // Validate parameters
//     if (!subscriptionId) {
//       throw new Error("Missing SUBSCRIPTION_ID in environment variables");
//     }

//     console.log("\nDeployment Parameters:");
//     console.log("Subscription ID:", subscriptionId);
//     console.log("VRF Coordinator:", vrfCoordinator);
//     console.log("Key Hash:", keyHash);

//     // Deploy contract
//     console.log("\nDeploying RandomNumberGenerator...");
//     const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
    
//     const randomNumberGenerator = await RandomNumberGenerator.deploy(
//       subscriptionId,
//       vrfCoordinator,
//       keyHash
//     );

//     await randomNumberGenerator.deployed();

//     console.log("\n✅ Contract deployed successfully!");
//     console.log(`Contract address: ${randomNumberGenerator.address}`);

//     // Verify contract on Etherscan
//     console.log("\nWaiting for blocks to be mined for verification...");
//     await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds

//     await hre.run("verify:verify", {
//       address: randomNumberGenerator.address,
//       constructorArguments: [
//         subscriptionId,
//         vrfCoordinator,
//         keyHash
//       ],
//     });

//     console.log("\n✅ Contract verified on Etherscan!");

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

//     // Print verification and usage instructions
//     console.log("\n📝 Verification command:");
//     console.log(`npx hardhat verify --network mumbai \\`);
//     console.log(`  ${randomNumberGenerator.address} \\`);
//     console.log(`  ${formattedSubId.toString()} \\`);
//     console.log(`  ${vrfCoordinator} \\`);
//     console.log(`  ${keyHash}`);

//     console.log("\n🔍 Next steps:");
//     console.log("1. Add the contract address as a consumer in your Chainlink VRF subscription");
//     console.log("2. Ensure your subscription has enough LINK tokens");
//     console.log("3. Call requestRandomNumber() to get a random number");
//     console.log("4. Use getLastRandomNumber() to retrieve the generated number (1-100)");

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
