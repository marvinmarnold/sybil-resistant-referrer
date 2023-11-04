// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC20Or721} from "./IERC20Or721.sol";
import { ByteHasher } from "./ByteHasher.sol";
import { IWorldID } from "./IWorldID.sol";

//@notice A Referral Campaign Contract for storing referres and their respective referees
contract ReferralCampaign is Ownable, Initializable {
    using ByteHasher for bytes;

    IERC20Or721 public rewardToken;

    /// @notice Thrown when attempting to reuse a nullifier
	error InvalidNullifier();

    //@dev Events of the contract
    event ReferrerAdded(address);
    event AcceptedReferral(address indexed, address);

    modifier onlyCampaignManager() {
        require(msg.sender == campaignManager, "Only the campaignManager can call this function");
        _;
    }

    modifier checkRtcApprovalBalance() {
        require(rewardToken.allowance(campaignManager, address(this)) >= (rewardReferrer + rewardReferee));
        _;
    }

    /*Campaign manager creates campaign onchain, supplying:*/

    //@dev Campaign Creator
    address campaignManager;

    // rtc Amount Approved be Campaign Manager
    uint256 rtcAmountApproved = 0;
    // rtc Amount Approved be Campaign Manager
    uint256 rtcTokenBalanceApproved = 0;


    //@dev ERC20 or 721 token address, BCTC, Participants must have some balance of this token in order to be eligible to claim rewards.
    address campaignTokenContract;

    //@dev minimum participation balance
    uint256 minCampaignTokenBalance;

    //@dev ERC20 or 721 reward token address, a Reward Token Contract (RTC) address to payout rewards in
    address rewardTokenContract;

    //@dev Max referees per referrer
    uint256 maxReferralsPerReferrer;

    //@dev Reward for referrer
    uint256 rewardReferrer;

    //@dev Reward for referee
    uint256 rewardReferee;

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

    mapping(address => bool) internal gateUser; 

    function initialize (
        address _manager, 
        address _campaignTokenContract, 
        address _rewardTokenContract, 
        uint256 _maxReferralsPerReferrer, 
        uint256 _rewardReferrer, 
        uint256 _rewardReferee, 
        uint256 _minCampaignTokenBalance,
        IWorldID _worldId,
        string memory _appId, 
        string memory _actionId
        
        ) public initializer {
        require(_rewardTokenContract != address(0), "_rewardTokenContract must be defined");
        // don't hardcode to ERC20
        rewardToken = IERC20Or721(_rewardTokenContract);
        campaignManager = _manager;
        campaignTokenContract = _campaignTokenContract;
        rewardTokenContract = _rewardTokenContract;
        maxReferralsPerReferrer = _maxReferralsPerReferrer;
        rewardReferrer = _rewardReferrer;
        rewardReferee = _rewardReferee;
        minCampaignTokenBalance = _minCampaignTokenBalance;
        externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
        worldId = _worldId;
    }

    /// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further details)
	/// @param root The root of the Merkle tree (returned by the JS widget).
	/// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
	/// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
	/// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
	function verifyAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public {
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


    //@dev Function to add a Referrer
    function addReferrer(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public {
        //@dev Instead of require, verification to be done by worldcoin
        require(numReferralsByReferrer[msg.sender] == 0, "Referrer already registered.");
        require(gateUser[msg.sender]!=true,"Already a Referrer or Referree");
        gateUser[msg.sender]=true;

        // verifyAndExecute(signal, root, nullifierHash, proof);

        // @dev Initiating the referrer to one to distinguish between already registered with no referees from the ones who have not registered.
        numReferralsByReferrer[msg.sender] = 1;
        emit ReferrerAdded(msg.sender);
    }

    //@dev To accept a referral, the referee will call this function
    //@params _referrer to link the referral
    function acceptReferral(address _referrer, address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public {

         address referee = msg.sender;

        //@dev Check if the referrer is registered
        require(numReferralsByReferrer[_referrer] > 0, "Referrer is not registered for this campaign.");
        require(numReferralsByReferrer[_referrer] <= maxReferralsPerReferrer, "Referrer has already claimed all referrals.");

        //@dev Checking the sender balance of campaign token for now, verification logic to added to confirm the mint for tokens is after campaign creation
        uint256 senderBalance = IERC20Or721(campaignTokenContract).balanceOf(msg.sender);
        require(senderBalance >= minCampaignTokenBalance, "Referree does not have enough campaign tokens to qualify.");
        require(gateUser[msg.sender]!=true,"Already a Referrer or Referree");
        gateUser[msg.sender]=true;
        // verifyAndExecute(signal, root, nullifierHash, proof);

        numReferralsByReferrer[_referrer]++;

        //@dev tranferring rewards (rtcToken) to referrer and referree
        rewardToken.transferFrom(campaignManager, _referrer, rewardReferrer);
        rewardToken.transferFrom(campaignManager, referee, rewardReferee);
        emit AcceptedReferral(referee ,_referrer);
    }
}

