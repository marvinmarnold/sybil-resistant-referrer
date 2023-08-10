// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC20Or721} from "./IERC20Or721.sol";

//@notice A Referral Campaign Contract for storing referres and their respective referees
contract ReferralCampaign is Ownable, Initializable {

    IERC20Or721 public rewardToken;

    //@dev Events of the contract
    event ReferrerAdded(address);
    event AcceptedReferral(address indexed, address);

    /*Campaign manager creates campaign onchain, supplying:*/

    // rtc Amount Approved be Campaign Manager
    uint256 rtcAmountApproved = 0;

    //@dev Campaign Creator
    address campaignManager;

    //@dev ERC20 or 721 token address, BCTC, Participants must have some balance of this token in order to be eligible to claim rewards.
    address campaignTokenContract;

    //@dev minimum participation balance
    uint256 minCampaignTokenBalance;

    //@dev ERC20 or 721 reward token address, a Reward Token Contract (RTC) address to payout rewards in.
    address rewardTokenContract;

    //@dev Max referees per referrer
    uint256 maxReferralsPerReferrer;

    //@dev Reward for referrer
    uint256 rewardReferrer;

    //@dev Reward for referee
    uint256 rewardReferee;

    // @dev Storing referee's per referrer
    mapping(address => uint256) internal numReferralsByReferrer;

    modifier onlyCampaignManager() {
        require(msg.sender == campaignManager, "Only the campaignManager can call this function");
        _;
    }

    modifier checkRtcApprovalBalance() {
        require(rewardToken.allowance(campaignManager, address(this)) >= (rewardReferrer + rewardReferee));
        _;
    }

    constructor() {}

    function initialize(
        address _manager, 
        address _campaignTokenContract, 
        address _rewardTokenContract, 
        uint256 _maxReferralsPerReferrer, 
        uint256 _rewardReferrer, 
        uint256 _rewardReferee, 
        uint256 _minCampaignTokenBalance
        ) public initializer {
        require(_rewardTokenContract != address(0), "_rewardTokenContract must be defined");
        // don't hardcode to ERC20
        rewardToken = IERC20Or721(_rewardTokenContract);
        rewardToken.approve(address(this), type(uint256).max);
        campaignManager = _manager;
        campaignTokenContract = _campaignTokenContract;
        rewardTokenContract = _rewardTokenContract;
        maxReferralsPerReferrer = _maxReferralsPerReferrer;
        rewardReferrer = _rewardReferrer;
        rewardReferee = _rewardReferee;
        minCampaignTokenBalance = _minCampaignTokenBalance;
    }

    //@dev Function to get approval of spending RTC tokens on behalf of campaign manager
    //@params _amount to be approved for spending
    function addBalance(uint256 _amount) public onlyCampaignManager {
        rewardToken.approve(address(this), _amount);
    }

    //@dev Function to add a Referrer
    function addReferrer() public {
        //@dev Instead of require, verification to be done by worldcoin
        require(numReferralsByReferrer[msg.sender] == 0, "Referrer already registered.");

        // @dev Initiating the referrer to one to distinguish between already registered with no referees from the ones who have not registered.
        numReferralsByReferrer[msg.sender] = 1;
        emit ReferrerAdded(msg.sender);
    }

    //@dev To accept a referral, the referee will call this function
    //@params _referrer to link the referral
    function acceptReferral(address _referrer) public checkRtcApprovalBalance {

        address referee = msg.sender;

        //@dev Check if the referrer is registered
        require(numReferralsByReferrer[_referrer] > 0, "Referrer is not registered for this campaign.");
        require(numReferralsByReferrer[_referrer] <= maxReferralsPerReferrer, "Referrer has already claimed all referrals.");

        //@dev Checking the sender balance of campaign token for now, verification logic to added to confirm the mint for tokens is after campaign creation
        uint256 senderBalance = IERC20Or721(campaignTokenContract).balanceOf(msg.sender);
        require(senderBalance >= minCampaignTokenBalance, "Referree does not have enough campaign tokens to qualify.");

        numReferralsByReferrer[_referrer]++;

        // @dev tranferring rewards (rtcToken) to referrer and referree
        rewardToken.transferFrom(campaignManager, _referrer, rewardReferrer);
        rewardToken.transferFrom(campaignManager, referee, rewardReferee);
        // SafeTransferLib.safeTransferFrom(rtcTokenAddress, address(this), _referrer, rewardReferrer);
        // SafeTransferLib.safeTransferFrom(rtcTokenAddress, address(this), referee, rewardReferee);
        emit AcceptedReferral(referee ,_referrer);
    }
}

