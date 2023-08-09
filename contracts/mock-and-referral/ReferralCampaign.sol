// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./RewardsAccount.sol"; // Import RewardsAccount interface
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

//@notice A Referral Campaign Contract for storing referres and their respective referees
contract ReferralCampaign is Ownable,Initializable {

    //@dev Events of the contract
    event ReferrerAdded(address);
    event AcceptedReferral(address,address);

    //@dev Campaign Creator
    address campaignManager;
    //@dev ERC20 or 721 token address
    address token;
    //@dev ERC20 or 721 reward token address
    address rtcToken;
    //@dev Max referees per referrer
    uint256 limit;
    //@dev Reward for referrer
    uint256 rewardReferrer;
    //@dev Reward for referee
    uint256 rewardReferee;

    // @dev need to fetch this somehow. i am out of clue (ashu)
    address rewardsAccountAddress;

    // @dev Storing referee's per referrer
    mapping(address=>uint256) internal referrers;

    function initialize(address _manager, address _rtcTokenAddress, address _rtcToken, uint256 _limit, uint256 _rewardReferrer, uint256 _rewardReferee) public initializer {
        campaignManager=_manager;
        token=_token;
        rtcToken=_rtcTokenAddress;
        limit=_limit;
        rewardReferrer=_rewardReferrer;
        rewardReferee=_rewardReferee;
    }

    
    //@dev Function to add a refere
    function addReferrer() public{
        //@dev Instead of require, verification to be done by worldcoin
        require(referrers[msg.sender]==0,"Referrer already registered");

        // @dev Initiating the referrer to one to distinguish between already registered with no referees from the ones who have not registered.
        referrers[msg.sender]=1;
        emit ReferrerAdded(msg.sender);
    }


    //@dev To accept a referral, the referee will call this function
    //@params _referrer to link the referral
    function acceptReferral(address _referrer) public {

        //@dev Check if the referrer is registered
        require(referrers[_referrer]>=1,"Wrong Referral");
        require(referrers[_referrer]<=limit,"Limit Reached");
        uint256 senderBalance = IERC20(token).balanceOf(msg.sender);

        //@dev Checking the sender balance for now, verification logic to added to confirm the mint for tokens is after campaign creation
        require(senderBalance>0,"No token Balance");

        referrers[_referrer]++;
        // @dev tranferring rewards (rtcToken) to referrer and referree from rewardsAccount
        SafeTransferLib.safeTransferFrom(rtcToken, rewardsAccountAddress, _referrer, rewardReferrer);
        SafeTransferLib.safeTransferFrom(rtcToken, rewardsAccountAddress, msg.sender, rewardReferee);
        emit AcceptedReferral(msg.sender,_referrer);

    }

}

