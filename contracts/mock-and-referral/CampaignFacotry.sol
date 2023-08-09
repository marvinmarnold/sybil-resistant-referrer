// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ReferralCampaign.sol";

//@notice A Referral Campaign Factory Contract, all referral campaign will be depolyed using this contract
contract CampaignFactory{
    //@dev Events
   event CampaignCreated(address indexed,address);
    
    //@dev Campaign struct with campiagn address and token address
    struct Campaign{
        address campaignAddress;
        address tokenAddress;
    }
    //@dev mapping to get campaigns of a managger
    mapping(address=> Campaign[]) managers;

    //@dev Create a referral campaign
    //@params Token address
    function addCampaign(address _tokenAddress) public payable returns (address campaignAddress){
        campaignAddress = address(new ReferralCampaign(msg.sender,_tokenAddress));
        Campaign memory _campaign= Campaign(campaignAddress,_tokenAddress);
        managers[msg.sender].push(_campaign);
        emit CampaignCreated(msg.sender,campaignAddress);
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

