const hre = require("hardhat");
require("dotenv").config();

async function main() {
  try {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    if (!CONTRACT_ADDRESS) {
      throw new Error("CONTRACT_ADDRESS not found in environment variables");
    }

    console.log("Contract address:", CONTRACT_ADDRESS);

    const [signer] = await hre.ethers.getSigners();
    console.log("Using account:", signer.address);

    const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
    const contract = await RandomNumberGenerator.attach(CONTRACT_ADDRESS);

    // Check contract state
    const owner = await contract.owner();
    console.log("Contract owner:", owner);

    const subId = await contract.checkSubscription();
    console.log("Subscription ID:", subId.toString());

    const keyHash = await contract.s_keyHash();
    console.log("Key Hash:", keyHash);

    const coordinator = await contract.getCoordinator();
    console.log("VRF Coordinator:", coordinator);

    // Check if the caller is the owner
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      throw new Error("The caller is not the contract owner");
    }

    console.log("Requesting random number...");
    
    // Request with higher gas limit
    const tx = await contract.requestRandomNumber({
      gasLimit: 3000000
    });

    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");
    
    const receipt = await tx.wait();
    
    if (receipt.status === 0) {
      throw new Error("Transaction failed");
    }

    const requestSentEvent = receipt.events?.find(e => e.event === "RequestSent");
    const requestId = requestSentEvent?.args?.requestId;

    if (!requestId) {
      throw new Error("No RequestSent event found");
    }

    console.log("Request ID:", requestId.toString());
    console.log("\nWaiting for Chainlink VRF response...");
    console.log("(This may take 1-2 minutes on Sepolia)");

    return new Promise((resolve) => {
      contract.once("NumberGenerated", async (randomNumber) => {
        console.log("\nRandom number generated!");
        console.log("Number (1-48):", randomNumber.toString());

        const [fulfilled, randomWords] = await contract.getRequestStatus(requestId);
        console.log("\nRequest Status:");
        console.log("Fulfilled:", fulfilled);
        console.log("Random Words:", randomWords.map(w => w.toString()));

        resolve();
      });

      // Set timeout
      setTimeout(() => {
        console.log("\nTimeout reached. You can check the contract on Etherscan for the result");
        console.log("Contract address:", CONTRACT_ADDRESS);
        resolve();
      }, 180000); // 3 minutes
    });

  } catch (error) {
    console.error("\nError:", error);
    if (error.error && error.error.message) {
      console.error("Revert reason:", error.error.message);
    }
    if (error.transaction) {
      console.error("Transaction details:", JSON.stringify(error.transaction, null, 2));
    }
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
//     // Get contract address from environment variable
//     const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
//     if (!CONTRACT_ADDRESS) {
//       throw new Error("Contract address not found in environment variables");
//     }

//     console.log("Getting contract instance...");
//     const RandomNumberGenerator = await hre.ethers.getContractFactory("RandomNumberGenerator");
//     const contract = RandomNumberGenerator.attach(CONTRACT_ADDRESS);

//     // Request random number
//     console.log("\nRequesting random number...");
//     const tx = await contract.requestRandomNumber();
//     console.log("Transaction hash:", tx.hash);

//     // Wait for transaction to be mined
//     console.log("\nWaiting for transaction to be mined...");
//     const receipt = await tx.wait();
    
//     // Get RequestSent event
//     const requestSentEvent = receipt.events.find(event => event.event === "RequestSent");
//     const requestId = requestSentEvent.args.requestId;
//     console.log("\nRequest ID:", requestId.toString());

//     // Set up event listener for RequestFulfilled
//     console.log("\nWaiting for Chainlink VRF response...");
//     return new Promise((resolve) => {
//       contract.once("NumberGenerated", async (randomNumber) => {
//         console.log("\n✅ Random number generated!");
//         console.log("Random Number (1-48):", randomNumber.toString());

//         // Get the full request status
//         const [fulfilled, randomWords] = await contract.getRequestStatus(requestId);
//         console.log("\nRequest Status:");
//         console.log("Fulfilled:", fulfilled);
//         console.log("Original Random Words:", randomWords.map(w => w.toString()));

//         resolve();
//       });
//     });

//   } catch (error) {
//     console.error("\n❌ Error:");
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