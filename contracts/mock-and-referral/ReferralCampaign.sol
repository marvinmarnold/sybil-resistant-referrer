// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;



import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

//@notice A Referral Campaign Contract for storing referres and their respective referees
contract ReferralCampaign is Ownable,Initializable {
   
    //@dev Events of the contract
    event ReferrerAdded(address);
    event AcceptedReferrer(address,address);

    //@dev Campaign Creator
    address campaignManager;
    //@dev ERC20 or 721 token address
    address token;
    //@dev Max referees per referrer
    uint256 limit;

    // @dev Storing referee's per referrer
    mapping(address=>uint256) internal referrers;

    function initialize(address _manager,address _token,uint256 _limit) public initializer {
        campaignManager=_manager;
        token=_token;
        limit=_limit;
    }

    
    //@dev Function to add a refere
    function addReferrer() public{
        //@dev Instead of require verification to be done by worldcoin
        require(referrers[msg.sender]==0,"Referrer already registered");

        // @dev Initiating the referrer to one to distinguish between already registered with no referees from the ones who have not registered.
        referrers[msg.sender]=1;
        emit ReferrerAdded(msg.sender);
    }


    //@dev To accept a referral , the referee will call this function
    //@params _referrer to link the referral
    function acceptReferral(address _referrer) public{

        //@dev Check if the referrer is registered
        require(referrers[_referrer]>=1,"Wrong Referral");
        require(referrers[_referrer]<=limit,"Limit Reached");
        uint256 senderBalance = IERC20(token).balanceOf(msg.sender);

        //@dev Checking the sender balance for now, verification logic to added to confirm the mint for tokens is after campaign creation
        require(senderBalance>0,"No token Balance");

        referrers[_referrer]++;
        emit AcceptedReferrer(msg.sender,_referrer);

    }

}

