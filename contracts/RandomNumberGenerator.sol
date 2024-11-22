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
    VRFCoordinatorV2Interface COORDINATOR;

    uint256[] public s_randomWords;
    uint256 public s_requestId;
    uint32 public callbackGasLimit = 100000;
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
        s_subscriptionId = subscriptionId;
        s_keyHash = keyHash;
        owner = msg.sender;
    }

    function requestRandomNumber() public onlyOwner returns (uint256 requestId) {
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
            randomWords: new uint256[](0)  // Cory initializing an empty array
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
        lastRandomNumber = (_randomWords[0] % 48) + 1; // Convert to 1-48 range
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
}








































































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