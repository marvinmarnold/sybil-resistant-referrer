// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./TestCampaign.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./IWorldID.sol";

//@notice A Referral Campaign Factory Contract, all referral campaign will be depolyed using this contract
contract TestFactory {

    //@dev Events
   event TestCreated(address indexed,address);
    //@dev Referral Campaign Implementation
    address immutable referralCampaign;
    
    //@dev Campaign struct with campiagn address and token address
    struct Campaign {
        address campaignAddress;
        address manager;
        address campaignTokenContract;
    }

    //@dev mapping to get campaigns of a managger
    mapping(address=> Campaign[]) campaignsForManager;

    constructor() {
        referralCampaign = address(new TestCampaign());
    }

    //@dev Create a referral campaign
    //@params actionId will the campaign ID
    function addCampaign(address _campaignTokenContract) public payable returns (address) {
        // Make a clone contract
        address clone = Clones.clone(referralCampaign);
        TestCampaign(clone).initialize(msg.sender, _campaignTokenContract);

        // Emit an event containing the new campaign information
        Campaign memory campaign = Campaign(clone, msg.sender, _campaignTokenContract);

        campaignsForManager[msg.sender].push(campaign);
        emit TestCreated(msg.sender, clone);
        return clone;
    }

    function getCampaigns(address _manager) external view returns (address[] memory campaignAddresses) {
        Campaign[] memory managerCampaigns = campaignsForManager[_manager];
        uint256 numberOfCampaigns = managerCampaigns.length;
        campaignAddresses = new address[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            campaignAddresses[i] = managerCampaigns[i].campaignAddress;
        }
    }
}
