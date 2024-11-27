// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract RandomNumberGenerator is VRFConsumerBaseV2 {
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);
    event NumberGenerated(uint256 randomNumber);

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }

    mapping(uint256 => RequestStatus) public s_requests;
    VRFCoordinatorV2Interface public COORDINATOR;

    uint256[] public s_randomWords;
    uint256 public s_requestId;
    uint32 public callbackGasLimit = 2500000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;

    uint64 public s_subscriptionId;
    bytes32 public s_keyHash;
    uint256 public lastRandomNumber;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        bytes32 keyHash
    ) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_keyHash = keyHash;
        s_subscriptionId = subscriptionId;
        owner = msg.sender;
    }

    function requestRandomNumber() external onlyOwner returns (uint256 requestId) {
        require(s_subscriptionId != 0, "Subscription ID not set");
        
        requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        s_requests[requestId] = RequestStatus({
            fulfilled: false,
            exists: true,
            randomWords: new uint256[](0)
        });

        s_requestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "Request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        
        lastRandomNumber = (_randomWords[0] % 48) + 1;
        
        emit RequestFulfilled(_requestId, _randomWords);
        emit NumberGenerated(lastRandomNumber);
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "Request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    function getLastRandomNumber() external view returns (uint256) {
        return lastRandomNumber;
    }

    function checkSubscription() external view returns (uint64) {
        return s_subscriptionId;
    }

    function getCoordinator() external view returns (address) {
        return address(COORDINATOR);
    }

    function updateSubscriptionId(uint64 newSubscriptionId) external onlyOwner {
        s_subscriptionId = newSubscriptionId;
    }

    function updateVRFCoordinator(address newCoordinator) external onlyOwner {
        COORDINATOR = VRFCoordinatorV2Interface(newCoordinator);
    }

    function updateKeyHash(bytes32 newKeyHash) external onlyOwner {
        s_keyHash = newKeyHash;
    }
}












































































// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

// contract RandomNumberGenerator is VRFConsumerBaseV2 {
//     event RequestSent(uint256 requestId, uint32 numWords);
//     event RequestFulfilled(uint256 requestId, uint256[] randomWords);
//     event NumberGenerated(uint256 randomNumber);

//     struct RequestStatus {
//         bool fulfilled;
//         bool exists;
//         uint256[] randomWords;
//     }

//     mapping(uint256 => RequestStatus) public s_requests;
//     VRFCoordinatorV2Interface COORDINATOR;

//     uint256[] public s_randomWords;
//     uint256 public s_requestId;
//     uint32 public callbackGasLimit = 2500000; // Increased gas limit
//     uint16 public requestConfirmations = 3;
//     uint32 public numWords = 1;

//     uint64 public s_subscriptionId;
//     bytes32 public s_keyHash;
//     uint256 public lastRandomNumber;
//     address public owner;

//     modifier onlyOwner() {
//         require(msg.sender == owner, "Not the owner");
//         _;
//     }

//     constructor(
//         uint64 subscriptionId,
//         address vrfCoordinator,
//         bytes32 keyHash
//     ) VRFConsumerBaseV2(vrfCoordinator) {
//         COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
//         s_keyHash = keyHash;
//         s_subscriptionId = subscriptionId;
//         owner = msg.sender;
//     }

//     function requestRandomNumber() external onlyOwner returns (uint256 requestId) {
//         require(s_subscriptionId != 0, "Subscription ID not set");
        
//         requestId = COORDINATOR.requestRandomWords(
//             s_keyHash,
//             s_subscriptionId,
//             requestConfirmations,
//             callbackGasLimit,
//             numWords
//         );

//         s_requests[requestId] = RequestStatus({
//             fulfilled: false,
//             exists: true,
//             randomWords: new uint256[](0)
//         });

//         s_requestId = requestId;
//         emit RequestSent(requestId, numWords);
//         return requestId;
//     }

//     function fulfillRandomWords(
//         uint256 _requestId,
//         uint256[] memory _randomWords
//     ) internal override {
//         require(s_requests[_requestId].exists, "Request not found");
//         s_requests[_requestId].fulfilled = true;
//         s_requests[_requestId].randomWords = _randomWords;
//         lastRandomNumber = (_randomWords[0] % 48) + 1;
//         emit RequestFulfilled(_requestId, _randomWords);
//         emit NumberGenerated(lastRandomNumber);
//     }

//     function getRequestStatus(
//         uint256 _requestId
//     ) external view returns (bool fulfilled, uint256[] memory randomWords) {
//         require(s_requests[_requestId].exists, "Request not found");
//         RequestStatus memory request = s_requests[_requestId];
//         return (request.fulfilled, request.randomWords);
//     }

//     function getLastRandomNumber() external view returns (uint256) {
//         return lastRandomNumber;
//     }

//     // Added function to check subscription
//     function checkSubscription() external view returns (uint64) {
//         return s_subscriptionId;
//     }
// }






















// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

// contract RandomNumberGenerator is VRFConsumerBaseV2 {
//     event RequestSent(uint256 requestId, uint32 numWords);
//     event RequestFulfilled(uint256 requestId, uint256[] randomWords);
//     event NumberGenerated(uint256 randomNumber);

//     struct RequestStatus {
//         bool fulfilled;
//         bool exists;
//         uint256[] randomWords;
//     }

//     mapping(uint256 => RequestStatus) public s_requests;
//     VRFCoordinatorV2Interface COORDINATOR;

//     uint256[] public s_randomWords;
//     uint256 public s_requestId;
//     uint32 public callbackGasLimit = 100000;
//     uint16 public requestConfirmations = 3;
//     uint32 public numWords = 1;

//     uint64 public s_subscriptionId;
//     bytes32 public s_keyHash;
//     uint256 public lastRandomNumber;

//     address public owner;

//     modifier onlyOwner() {
//         require(msg.sender == owner, "Not the owner");
//         _;
//     }

//     constructor(
//         uint64 subscriptionId,
//         address vrfCoordinator,
//         bytes32 keyHash
//     ) VRFConsumerBaseV2(vrfCoordinator) {
//         COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
//         s_subscriptionId = subscriptionId;
//         s_keyHash = keyHash;
//         owner = msg.sender;
//     }

//     function requestRandomNumber() public onlyOwner returns (uint256 requestId) {
//         requestId = COORDINATOR.requestRandomWords(
//             s_keyHash,
//             s_subscriptionId,
//             requestConfirmations,
//             callbackGasLimit,
//             numWords
//         );
//         s_requests[requestId] = RequestStatus({
//             fulfilled: false,
//             exists: true,
//             randomWords: new uint256[](0)  // Cory initializing an empty array
//         });
//         s_requestId = requestId;
//         emit RequestSent(requestId, numWords);
//         return requestId;
//     }

//     function fulfillRandomWords(
//         uint256 _requestId,
//         uint256[] memory _randomWords
//     ) internal override {
//         require(s_requests[_requestId].exists, "Request not found");
//         s_requests[_requestId].fulfilled = true;
//         s_requests[_requestId].randomWords = _randomWords;
//         lastRandomNumber = (_randomWords[0] % 48) + 1; // Convert to 1-48 range
//         emit RequestFulfilled(_requestId, _randomWords);
//         emit NumberGenerated(lastRandomNumber);
//     }

//     function getRequestStatus(
//         uint256 _requestId
//     ) external view returns (bool fulfilled, uint256[] memory randomWords) {
//         require(s_requests[_requestId].exists, "Request not found");
//         RequestStatus memory request = s_requests[_requestId];
//         return (request.fulfilled, request.randomWords);
//     }

//     function getLastRandomNumber() external view returns (uint256) {
//         return lastRandomNumber;
//     }
// }























































// import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

// contract RandomNumberGenerator is VRFConsumerBase {
//     bytes32 internal keyHash;
//     uint256 internal fee;
//     uint256 public randomResult;

//     // Correct checksummed LINK address for Sepolia Testnet
//     address constant LINK_ADDRESS = 0x4E470dc7321e8F5C3b9F3d6f2A8176525789e05b;

//     constructor(uint256 _subscriptionId, address _vrfCoordinator, bytes32 _keyHash)
//         VRFConsumerBase(_vrfCoordinator, LINK_ADDRESS) 
//     {
//         keyHash = _keyHash;
//         fee = 0.1 * 10 ** 18; // Adjust this according to Sepolia Testnet requirements
//     }

//     function getRandomNumber() public returns (bytes32 requestId) {
//         require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
//         return requestRandomness(keyHash, fee);
//     }

//     function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
//         randomResult = randomness; // Store the randomness
//     }
// }



















































// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
// import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

// contract RandomNumberGenerator is VRFConsumerBaseV2, ConfirmedOwner {
//     event RequestSent(uint256 requestId, uint32 numWords);
//     event RequestFulfilled(uint256 requestId, uint256[] randomWords);
//     event NumberGenerated(uint256 randomNumber);

//     struct RequestStatus {
//         bool fulfilled;
//         bool exists;
//         uint256[] randomWords;
//     }

//     mapping(uint256 => RequestStatus) public s_requests; 
//     VRFCoordinatorV2Interface COORDINATOR;

//     uint256[] public s_randomWords;
//     uint256 public s_requestId;
//     uint32 public callbackGasLimit = 100000;
//     uint16 public requestConfirmations = 3;
//     uint32 public numWords = 1;

//     uint64 public s_subscriptionId;
//     bytes32 public s_keyHash;
//     uint256 public lastRandomNumber;

//     constructor(
//         uint64 subscriptionId,
//         address vrfCoordinator,
//         bytes32 keyHash
//     ) VRFConsumerBaseV2(vrfCoordinator) ConfirmedOwner(msg.sender) {
//         COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
//         s_subscriptionId = subscriptionId;
//         s_keyHash = keyHash;
//     }

//     function requestRandomNumber() public onlyOwner returns (uint256 requestId) {
//         requestId = COORDINATOR.requestRandomWords(
//             s_keyHash,
//             s_subscriptionId,
//             requestConfirmations,
//             callbackGasLimit,
//             numWords
//         );
//         s_requests[requestId] = RequestStatus({
//             fulfilled: false,
//             exists: true,
//             randomWords: new uint256[](0)
//         });
//         s_requestId = requestId;
//         emit RequestSent(requestId, numWords);
//         return requestId;
//     }

//     function fulfillRandomWords(
//         uint256 _requestId,
//         uint256[] memory _randomWords
//     ) internal override {
//         require(s_requests[_requestId].exists, "request not found");
//         s_requests[_requestId].fulfilled = true;
//         s_requests[_requestId].randomWords = _randomWords;
//         lastRandomNumber = (_randomWords[0] % 48) + 1; // Convert to 1-48 range
//         emit RequestFulfilled(_requestId, _randomWords);
//         emit NumberGenerated(lastRandomNumber);
//     }

//     function getRequestStatus(
//         uint256 _requestId
//     ) external view returns (bool fulfilled, uint256[] memory randomWords) {
//         require(s_requests[_requestId].exists, "request not found");
//         RequestStatus memory request = s_requests[_requestId];
//         return (request.fulfilled, request.randomWords);
//     }

//     function getLastRandomNumber() external view returns (uint256) {
//         return lastRandomNumber;
//     }
// }















// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
// import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

// contract RandomNumberGenerator is VRFConsumerBaseV2, ConfirmedOwner {
//     event RequestSent(uint256 requestId, uint32 numWords);
//     event RequestFulfilled(uint256 requestId, uint256[] randomWords);
//     event NumberGenerated(uint256 randomNumber);

//     struct RequestStatus {
//         bool fulfilled;
//         bool exists;
//         uint256[] randomWords;
//     }

//     mapping(uint256 => RequestStatus) public s_requests; 
//     VRFCoordinatorV2Interface COORDINATOR;

//     uint256[] public s_randomWords;
//     uint256 public s_requestId;
//     uint32 public callbackGasLimit = 100000;
//     uint16 public requestConfirmations = 3;
//     uint32 public numWords = 1;

//     // Constructor variables
//     uint64 public s_subscriptionId;
//     bytes32 public s_keyHash;
//     uint256 public lastRandomNumber;

//     constructor(
//         uint64 subscriptionId,
//         address vrfCoordinator,
//         bytes32 keyHash
//     ) VRFConsumerBaseV2(vrfCoordinator) ConfirmedOwner(msg.sender) {
//         COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
//         s_subscriptionId = subscriptionId;
//         s_keyHash = keyHash;
//     }

//     function requestRandomNumber() public onlyOwner returns (uint256 requestId) {
//         requestId = COORDINATOR.requestRandomWords(
//             s_keyHash,
//             s_subscriptionId,
//             requestConfirmations,
//             callbackGasLimit,
//             numWords
//         );
//         s_requests[requestId] = RequestStatus({
//             fulfilled: false,
//             exists: true,
//             randomWords: new uint256[](0)
//         });
//         s_requestId = requestId;
//         emit RequestSent(requestId, numWords);
//         return requestId;
//     }

//     function fulfillRandomWords(
//         uint256 _requestId,
//         uint256[] memory _randomWords
//     ) internal override {
//         require(s_requests[_requestId].exists, "request not found");
//         s_requests[_requestId].fulfilled = true;
//         s_requests[_requestId].randomWords = _randomWords;
//         lastRandomNumber = (_randomWords[0] % 48) + 1; // Convert to 1-48 range
//         emit RequestFulfilled(_requestId, _randomWords);
//         emit NumberGenerated(lastRandomNumber);
//     }

//     function getRequestStatus(
//         uint256 _requestId
//     ) external view returns (bool fulfilled, uint256[] memory randomWords) {
//         require(s_requests[_requestId].exists, "request not found");
//         RequestStatus memory request = s_requests[_requestId];
//         return (request.fulfilled, request.randomWords);
//     }

//     function getLastRandomNumber() external view returns (uint256) {
//         return lastRandomNumber;
//     }
// }