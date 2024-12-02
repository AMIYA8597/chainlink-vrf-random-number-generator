const hre = require("hardhat");

async function main() {
    try {
        const CONTRACT_ADDRESS = "0xdc88c03ae9a852d7777a95b7e28dff7e6bc0ee0d";

        console.log("Getting contract instance...");
        const Contract = await hre.ethers.getContractFactory("JackVRFNumberGenerator");
        const contract = await Contract.attach(CONTRACT_ADDRESS);

        console.log("Requesting a random number...");

        const tx = await contract.requestRandomWords();

        console.log("Transaction hash:", tx.hash);
        console.log("Waiting for confirmation...");

        const receipt = await tx.wait();
        if (receipt.status === 0) {
            throw new Error("Transaction failed with receipt: " + JSON.stringify(receipt));
        }

        console.log("Transaction confirmed in block:", receipt.blockNumber);

        // Get the requestId from the RequestSent event
        const requestId = receipt.events.find(event => event.event === "RequestSent").args.requestId;
        console.log("Request ID:", requestId.toString());

        // Wait for the random number (polling)
        console.log("\nWaiting for Chainlink VRF response (this may take several minutes)...");

        let fulfilled = false;
        let number;
        for (let i = 0; i < 20; i++) {
            console.log("Checking request status...");

            [fulfilled, number] = await contract.getRequestStatus(requestId);

            if (fulfilled) {
                break;
            }

            await new Promise(r => setTimeout(r, 30000)); // Wait 30 seconds between checks
        }

        if (fulfilled) {
            console.log("\nRandom number received!");
            console.log("Number (1-48):", number.toString());
        } else {
            console.log("\nDid not receive random number after 10 minutes");
        }

    } catch (error) {
        console.error("\nError details:");
        console.error(error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Top-level error:", error);
        process.exit(1);
    });





















// const hre = require("hardhat");

// async function main() {
//     try {
//         // Replace with your deployed contract address
//         const CONTRACT_ADDRESS = "0xdc88c03ae9a852d7777a95b7e28dff7e6bc0ee0d";

//         console.log("Getting contract instance...");
//         const Contract = await hre.ethers.getContractFactory("JackVRFNumberGenerator");
//         const contract = await Contract.attach(CONTRACT_ADDRESS);

//         console.log("Requesting a random number...");

//         const tx = await contract.requestRandomWords();

//         console.log("Transaction hash:", tx.hash);
//         console.log("Waiting for confirmation...");

//         const receipt = await tx.wait();
//         if (receipt.status === 0) {
//             throw new Error("Transaction failed with receipt: " + JSON.stringify(receipt));
//         }

//         console.log("Transaction confirmed in block:", receipt.blockNumber);

//         // Get the requestId from the RequestSent event
//         const requestId = receipt.events.find(event => event.event === "RequestSent").args.requestId;
//         console.log("Request ID:", requestId.toString());

//         // Wait for the random number (polling)
//         console.log("\nWaiting for Chainlink VRF response (this may take several minutes)...");

//         let fulfilled = false;
//         let number;
//         for (let i = 0; i < 20; i++) {
//             console.log("Checking request status...");

//             [fulfilled, number] = await contract.getRequestStatus(requestId);

//             if (fulfilled) {
//                 break;
//             }

//             await new Promise(r => setTimeout(r, 30000)); // Wait 30 seconds between checks
//         }

//         if (fulfilled) {
//             console.log("\nRandom number received!");
//             console.log("Number (1-48):", number.toString());
//         } else {
//             console.log("\nDid not receive random number after 10 minutes");
//         }

//     } catch (error) {
//         console.error("\nError details:");
//         console.error(error);
//     }
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error("Top-level error:", error);
//         process.exit(1);
//     });













































// const hre = require("hardhat");

// async function main() {
//     try {
//         // Replace with your deployed contract address
//         const CONTRACT_ADDRESS = "0xDC88c03Ae9A852D7777a95B7E28dFF7e6bc0ee0d";

//         console.log("Getting contract instance...");
//         const Contract = await hre.ethers.getContractFactory("JackVRFNumberGenerator");
//         const contract = await Contract.attach(CONTRACT_ADDRESS);

//         console.log("Requesting random numbers...");

//         const tx = await contract.requestRandomWords({
//             gasLimit: 3000000 // Adjusted gas limit
//         });

//         console.log("Transaction hash:", tx.hash);
//         console.log("Waiting for confirmation...");

//         const receipt = await tx.wait();
//         if (receipt.status === 0) {
//             throw new Error("Transaction failed with receipt: " + JSON.stringify(receipt));
//         }

//         console.log("Transaction confirmed in block:", receipt.blockNumber);

//         // Get the requestId from the RequestSent event
//         const requestId = receipt.events.find(event => event.event === "RequestSent").args.requestId;
//         console.log("Request ID:", requestId.toString());

//         // Wait for the random numbers (polling)
//         console.log("\nWaiting for Chainlink VRF response (this may take several minutes)...");

//         let fulfilled = false;
//         let numbers;
//         for (let i = 0; i < 20; i++) {
//             console.log("Checking request status...");

//             [fulfilled, numbers] = await contract.getRequestStatus(requestId);

//             if (fulfilled) {
//                 break;
//             }

//             await new Promise(r => setTimeout(r, 30000)); // Wait 30 seconds between checks
//         }

//         if (fulfilled) {
//             console.log("\nRandom numbers received!");
//             console.log("Numbers (1-48):", numbers.map(n => n.toString()));
//         } else {
//             console.log("\nDid not receive random numbers after 10 minutes");
//         }

//     } catch (error) {
//         console.error("\nError details:");
//         console.error(error);
//     }
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error("Top-level error:", error);
//         process.exit(1);
//     });

