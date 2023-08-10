// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

//@notice A Referral Campaign Contract for storing referres and their respective referees
contract ReferralCampaign is Ownable,Initializable {

    IERC20 public rtcToken;

    //@dev Events of the contract
    event ReferrerAdded(address);
    event AcceptedReferral(address indexed,address);

    /*Campaign manager creates campaign onchain, supplying:*/

    //@dev Campaign Creator
    address campaignManager;
    //@dev ERC20 or 721 token address, BCTC, Participants must have some balance of this token in order to be eligible to claim rewards.
    address token;
    //@dev ERC20 or 721 reward token address, a Reward Token Contract (RTC) address to payout rewards in.
    address rtcTokenAddress;
    //@dev Max total referrals possible, ***not used yet***
    // address maxRefferals;
    //@dev Max referees per referrer
    uint256 referralsLimit;
    //@dev Reward for referrer
    uint256 rewardReferrer;
    //@dev Reward for referee
    uint256 rewardReferee;
    //@dev minimum participation balance, ***not used yet***
    // uint256 minBalance;

    // @dev Storing referee's per referrer
    mapping(address=>uint256) internal referrers;

    constructor(address _rtcTokenAddress ) {
        require(_rtcTokenAddress != address(0), "_rtcTokenAddress should be valid");
        rtcToken = IERC20(_rtcTokenAddress);
    }

    function initialize (
        address _manager, 
        address _token, 
        address _rtcTokenAddress, 
        uint256 _limit, 
        uint256 _rewardReferrer, 
        uint256 _rewardReferee, 
        uint256 _minBalance
        ) public initializer {
        campaignManager=_manager;
        token=_token;
        rtcTokenAddress=_rtcTokenAddress;
        referralsLimit=_limit;
        rewardReferrer=_rewardReferrer;
        rewardReferee=_rewardReferee;
        minBalance=_minBalance;
    }

    
    //@dev Function to add a Referrer
    function addReferrer() public {

        //@dev Instead of require, verification to be done by worldcoin
        require(referrers[msg.sender]==0, "Referrer already registered");

        // @dev Initiating the referrer to one to distinguish between already registered with no referees from the ones who have not registered.
        referrers[msg.sender] = 1;
        emit ReferrerAdded(msg.sender);
    }


    //@dev To accept a referral, the referee will call this function
    //@params _referrer to link the referral
    function acceptReferral(address _referrer) public {

        address referee = msg.sender;

        //@dev Check if the referrer is registered
        require(referrers[_referrer]>=1,"Wrong Referral");
        require(referrers[_referrer]<=referralsLimit,"Max number of Referees Limit Reached");

        //@dev Checking the sender balance of BCTC for now, verification logic to added to confirm the mint for tokens is after campaign creation
        uint256 senderBalance = IERC20(token).balanceOf(msg.sender);
        require(senderBalance>0,"No token Balance");

        referrers[_referrer]++;

        // @dev tranferring rewards (rtcToken) to referrer and referree
        SafeTransferLib.safeTransferFrom(rtcTokenAddress, address(this), _referrer, rewardReferrer);
        SafeTransferLib.safeTransferFrom(rtcTokenAddress, address(this), referee, rewardReferee);
        emit AcceptedReferral(referee,_referrer);

    }

}

