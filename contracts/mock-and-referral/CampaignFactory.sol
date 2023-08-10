// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ReferralCampaign.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
//@notice A Referral Campaign Factory Contract, all referral campaign will be depolyed using this contract
contract CampaignFactory{
    //@dev Events
   event CampaignCreated(address indexed,address);
    
    //@dev Referral Campaign Implementation
    address immutable referralCampaign;

    //@dev Campaign struct with campiagn address and token address
    struct Campaign{
        address campaignAddress;
        address tokenAddress;
        uint256 limit;
    }
    //@dev mapping to get campaigns of a managger
    mapping(address=> Campaign[]) managers;


    constructor(){
        referralCampaign = address(new ReferralCampaign());
    }

    //@dev Create a referral campaign
    //@params Token address
    function addCampaign(address _tokenAddress,uint256 _limit) public payable returns (address){
        address clone = Clones.clone(referralCampaign);
        ReferralCampaign(clone).initialize(msg.sender,_tokenAddress,_limit);
        Campaign memory campaign= Campaign(clone,_tokenAddress,_limit);
        managers[msg.sender].push(campaign);
        emit CampaignCreated(msg.sender,clone);
        return clone;
    }

    function getCampaigns(address _manager) external view returns (address[] memory campaignAddresses) {
        Campaign[] memory managerCampaigns = managers[_manager];
        uint256 numberOfCampaigns = managerCampaigns.length;

        campaignAddresses = new address[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            campaignAddresses[i] = managerCampaigns[i].campaignAddress;
        }
    }

    

}

