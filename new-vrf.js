require('dotenv').config();
const { ethers } = require('ethers');

// Contract ABI - Include only the functions we need
const contractABI = [
    "function requestRandomWords() external returns (uint256)",
    "function getRequestStatus(uint256 _requestId) external view returns (bool fulfilled, uint256[5] mainNumbers, uint256[2] additionalNumbers)",
    "event RequestSent(uint256 requestId)",
    "event NumbersGenerated(uint256[5] mainNumbers, uint256[2] additionalNumbers)"
];

async function main() {
    // Connect to Sepolia network
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    
    // Create wallet instance
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Create contract instance
    const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        contractABI,
        wallet
    );

    try {
        // Request random numbers
        console.log('Requesting random numbers...');
        const tx = await contract.requestRandomWords();
        console.log('Transaction hash:', tx.hash);
        
        // Wait for transaction to be mined
        const receipt = await tx.wait();
        
        // Find RequestSent event and get requestId
        const requestSentEvent = receipt.logs
            .map(log => {
                try {
                    return contract.interface.parseLog(log);
                } catch (e) {
                    return null;
                }
            })
            .find(event => event && event.name === 'RequestSent');

        if (!requestSentEvent) {
            throw new Error('RequestSent event not found in transaction');
        }

        const requestId = requestSentEvent.args[0];
        console.log('Request ID:', requestId.toString());

        // Set up event listener for NumbersGenerated
        console.log('Waiting for random numbers to be generated...');
        
        // Promise that resolves when NumbersGenerated event is emitted
        const numbersPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                contract.removeAllListeners();
                reject(new Error('Timeout waiting for random numbers'));
            }, 300000); // 5 minute timeout

            contract.on('NumbersGenerated', async (mainNumbers, additionalNumbers) => {
                clearTimeout(timeout);
                contract.removeAllListeners();
                resolve({ mainNumbers, additionalNumbers });
            });
        });

        // Wait for numbers to be generated
        const { mainNumbers, additionalNumbers } = await numbersPromise;
        
        console.log('Random numbers generated!');
        console.log('Main numbers:', mainNumbers.map(n => n.toString()));
        console.log('Additional numbers:', additionalNumbers.map(n => n.toString()));

        // Get final status from contract
        const status = await contract.getRequestStatus(requestId);
        console.log('\nFinal status from contract:');
        console.log('Fulfilled:', status[0]);
        console.log('Main numbers:', status[1].map(n => n.toString()));
        console.log('Additional numbers:', status[2].map(n => n.toString()));

    } catch (error) {
        console.error('Error:', error);
    }
}

main().catch(console.error);














































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