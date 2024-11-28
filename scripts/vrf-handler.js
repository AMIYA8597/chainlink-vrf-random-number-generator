const ethers = require('ethers');
const dotenv = require('dotenv');

dotenv.config();

const ABI = [
  {
    "inputs": [],
    "name": "requestRandomWords",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastRequestId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_requestId", "type": "uint256"}],
    "name": "getRequestStatus",
    "outputs": [
      {"internalType": "bool", "name": "fulfilled", "type": "bool"},
      {"internalType": "uint256[5]", "name": "mainNumbers", "type": "uint256[5]"},
      {"internalType": "uint256[2]", "name": "additionalNumbers", "type": "uint256[2]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      }
    ],
    "name": "RequestSent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256[5]",
        "name": "mainNumbers",
        "type": "uint256[5]"
      },
      {
        "indexed": false,
        "internalType": "uint256[2]",
        "name": "additionalNumbers",
        "type": "uint256[2]"
      }
    ],
    "name": "NumbersGenerated",
    "type": "event"
  }
];

async function getRandomNumbers() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);

  console.log("Requesting random numbers from Chainlink VRF...");
  
  try {
    // Request random numbers
    const tx = await contract.requestRandomWords({
      gasLimit: 1000000,
      maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
      maxPriorityFeePerGas: ethers.utils.parseUnits("10", "gwei")
    });

    console.log("Transaction sent. Hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // Get the request ID
    const requestId = await contract.lastRequestId();
    console.log("Request ID:", requestId.toString());

    console.log("Waiting for Chainlink VRF response (this may take several minutes)...");

    // Set up event listener for NumbersGenerated event
    return new Promise((resolve, reject) => {
      contract.once("NumbersGenerated", async (mainNumbers, additionalNumbers) => {
        console.log("\n✅ Random numbers generated!");
        console.log("Main numbers (1-48):", mainNumbers.map(n => n.toString()).join(", "));
        console.log("Additional numbers (1-11):", additionalNumbers.map(n => n.toString()).join(", "));

        try {
          const [fulfilled, main, additional] = await contract.getRequestStatus(requestId);
          console.log("\nRequest Status:");
          console.log("Fulfilled:", fulfilled);
          console.log("Main Numbers:", main.map(n => n.toString()).join(", "));
          console.log("Additional Numbers:", additional.map(n => n.toString()).join(", "));
        } catch (error) {
          console.log("Could not fetch request status:", error.message);
        }

        resolve();
      });

      // Set a timeout for 10 minutes
      setTimeout(() => {
        reject(new Error("Timeout: No response received from Chainlink VRF after 10 minutes."));
      }, 600000);
    });

  } catch (error) {
    console.error("\n❌ Error occurred:", error.message);
    if (error.transaction) {
      console.log("Transaction hash:", error.transaction.hash);
    }
    throw error;
  }
}

getRandomNumbers()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });

















































// const ethers = require('ethers');
// const dotenv = require('dotenv');
// const ABI = require('./abi/abi.json');

// dotenv.config();

// async function validateOwnership(contract, signer) {
//     try {
//         console.log("\nChecking contract ownership...");
//         const owner = await contract.owner();
//         console.log("Contract owner:", owner);
//         console.log("Caller address:", signer.address);
        
//         if (owner.toLowerCase() !== signer.address.toLowerCase()) {
//             throw new Error("Caller is not the contract owner");
//         }
//         return true;
//     } catch (error) {
//         console.error("\nOwnership validation error:", error.message);
//         return false;
//     }
// }

// async function checkRequestStatus(contract, requestId) {
//     try {
//         const [fulfilled, mainNumbers, additionalNumbers] = await contract.getRequestStatus(requestId);
//         if (fulfilled) {
//             console.log("\n✅ Numbers generated!");
//             console.log("Main numbers (1-48):", mainNumbers.map(n => n.toString()).join(", "));
//             console.log("Additional numbers (1-11):", additionalNumbers.map(n => n.toString()).join(", "));
//             return true;
//         }
//         return false;
//     } catch (error) {
//         console.log("Could not fetch request status:", error.message);
//         return false;
//     }
// }

// async function generateRandomNumbers() {
//     let provider, wallet, contract, requestId;

//     try {
//         // Environment validation
//         const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
//         const PRIVATE_KEY = process.env.PRIVATE_KEY;
//         const RPC_URL = process.env.SEPOLIA_RPC_URL;

//         if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
//             throw new Error("Missing required environment variables");
//         }

//         console.log("Initializing VRF request...");
//         console.log("Contract address:", CONTRACT_ADDRESS);

//         // Setup provider and wallet
//         provider = new ethers.providers.JsonRpcProvider(RPC_URL);
//         wallet = new ethers.Wallet(PRIVATE_KEY, provider);
//         console.log("Using account:", wallet.address);

//         // Get network details
//         const network = await provider.getNetwork();
//         console.log("Connected to network:", network.name);

//         // Create contract instance
//         contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

//         // Validate ownership
//         const isValidOwner = await validateOwnership(contract, wallet);
//         if (!isValidOwner) {
//             throw new Error("Ownership validation failed");
//         }

//         // Get current gas price and add 150% buffer for Sepolia
//         const gasPrice = (await provider.getGasPrice()).mul(250).div(100);
//         console.log("Current gas price (with buffer):", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");

//         // Check wallet balance
//         const balance = await provider.getBalance(wallet.address);
//         console.log("Wallet balance:", ethers.utils.formatEther(balance), "ETH");

//         if (balance.lt(ethers.utils.parseEther("0.01"))) {
//             throw new Error("Insufficient ETH balance");
//         }

//         console.log("\nRequesting random numbers from Chainlink VRF...");
        
//         // Request random numbers with specific gas settings
//         const tx = await contract.requestRandomWords({
//             gasLimit: 1000000,  // Increased gas limit
//             maxFeePerGas: gasPrice,
//             maxPriorityFeePerGas: gasPrice.div(2)
//         });

//         console.log("Transaction hash:", tx.hash);
//         console.log("Waiting for confirmation...");
        
//         const receipt = await tx.wait();
        
//         if (receipt.status === 0) {
//             throw new Error("Transaction failed");
//         }

//         // Find RequestSent event
//         const requestSentEvent = receipt.events?.find(e => e.event === "RequestSent");
//         requestId = requestSentEvent?.args?.requestId;

//         if (!requestId) {
//             throw new Error("No RequestSent event found");
//         }

//         console.log("Request ID:", requestId.toString());
//         console.log("\nWaiting for Chainlink VRF response...");
//         console.log("(This may take several minutes on Sepolia)");

//         // Set up event listener
//         contract.on("NumbersGenerated", (mainNumbers, additionalNumbers) => {
//             console.log("\n✅ Numbers generated from event!");
//             console.log("Main numbers (1-48):", mainNumbers.map(n => n.toString()).join(", "));
//             console.log("Additional numbers (1-11):", additionalNumbers.map(n => n.toString()).join(", "));
//             process.exit(0);
//         });

//         // Check status every 30 seconds for up to 30 minutes
//         for (let i = 0; i < 60; i++) {
//             await new Promise(resolve => setTimeout(resolve, 30000));
//             console.log(`Checking request status... (Attempt ${i + 1})`);
//             const fulfilled = await checkRequestStatus(contract, requestId);
//             if (fulfilled) {
//                 process.exit(0);
//             }
//         }

//         throw new Error("Timeout reached. The request may still be processing.");

//     } catch (error) {
//         console.error("\n❌ Error occurred:");
//         console.error(error.message || error);
        
//         if (error.transaction) {
//             console.error("Transaction hash:", error.transaction.hash);
//         }
        
//         if (contract && requestId) {
//             console.log("\nAttempting to fetch final status...");
//             await checkRequestStatus(contract, requestId);
//         }
        
//         console.log("\nCheck the transaction and contract on Etherscan:");
//         console.log(`https://sepolia.etherscan.io/address/${process.env.CONTRACT_ADDRESS}`);
        
//         process.exit(1);
//     }
// }

// generateRandomNumbers()
//     .catch((error) => {
//         console.error("Unhandled error:", error);
//         process.exit(1);
//     });