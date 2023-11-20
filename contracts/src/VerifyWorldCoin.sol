// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC20Or721} from "./IERC20Or721.sol";
import { ByteHasher } from "./ByteHasher.sol";
import { IWorldID } from "./IWorldID.sol";
import "./lzApp/NonblockingLzApp.sol";

//@notice A Referral Campaign Contract for storing referres and their respective referees
contract VerifyWorldCoin is Ownable, Initializable,NonblockingLzApp  {
    using ByteHasher for bytes;

    IERC20Or721 public rewardToken;

    /// @notice Thrown when attempting to reuse a nullifier
	error InvalidNullifier();

    //@dev Events of the contract
    event ReferrerAdded(address);
    event AcceptedReferral(address indexed, address);

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}

    event RecievedMessage(address,address,uint,uint16);
    event VerifiedWorldCoin(address,uint16);
    function _nonblockingLzReceive(uint16 _srcChainId, bytes memory, uint64, bytes memory _payload) internal override {
        (address signal,uint256 root,uint256 nullifierHash,uint256[8] memory proof)=abi.decode(_payload,(address ,uint256,uint256,uint256[8]));
        verifyAndExecute(signal, root, nullifierHash, proof);
        emit VerifiedWorldCoin(signal,_srcChainId);
    }
    function send(uint16 _dstChainId,address _tokenAddress) public payable {
        bytes memory _payload = abi.encode(msg.sender,_tokenAddress);
        _lzSend(_dstChainId, _payload, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }


    //@dev Worldcoin vars 
    /// @dev The World ID instance that will be used for verifying proofs
	IWorldID internal worldId;

	/// @dev The contract's external nullifier hash
	uint256 internal externalNullifier;

	/// @dev The World ID group ID (always 1)
	uint256 internal immutable groupId = 1;

	/// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
	mapping(uint256 => bool) internal nullifierHashes;

    // @dev Storing referee's per referrer
    mapping(address => uint256) internal numReferralsByReferrer;

    function initialize (
        IWorldID _worldId,
        string memory _appId, 
        string memory _actionId
        
        ) public initializer {

        externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
        worldId = _worldId;
    }


    /// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further details)
	/// @param root The root of the Merkle tree (returned by the JS widget).
	/// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
	/// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
	/// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
	function verifyAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] memory proof) public {
		// First, we make sure this person hasn't done this before
		if (nullifierHashes[nullifierHash]) revert InvalidNullifier();
		// We now verify the provided proof is valid and the user is verified by World ID
		worldId.verifyProof(
			root,
			groupId,
			abi.encodePacked(signal).hashToField(),
			nullifierHash,
			externalNullifier,
			proof
		);
		// We now record the user has done this, so they can't do it again (proof of uniqueness)
		nullifierHashes[nullifierHash] = true;
	}
}

