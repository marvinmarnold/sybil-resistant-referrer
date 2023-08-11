// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ReferralCampaign.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./IWorldID.sol";

//@notice A Referral Campaign Factory Contract, all referral campaign will be depolyed using this contract
contract CampaignFactory {

    //@dev Events
   event CampaignCreated(address indexed,address);
    
    //@dev Referral Campaign Implementation
    address immutable referralCampaign;

    //@dev WorldID Address Base
    IWorldID worldID = IWorldID(0x515f06B36E6D3b707eAecBdeD18d8B384944c87f);

    //@dev Worldcoin Developer portal App ID , TO be updated
    string appID="app_staging_390a3ed8c033ea9b6fa30e64a72d383d";

    //@dev Campaign struct with campiagn address and token address
    struct Campaign{
        address campaignAddress;
        address manager;
        address campaignTokenContract;
        address rewardTokenContract;
        uint256 maxReferralsPerReferrer;
        uint256 rewardReferrer;
        uint256 rewardReferee;
        uint256 minCampaignTokenBalance;
    }

    //@dev mapping to get campaigns of a managger
    mapping(address=> Campaign[]) campaignsForManager;

    constructor() {
        referralCampaign = address(new ReferralCampaign());
    }

    //@dev Create a referral campaign
    //@params actionId will the campaign ID
    function addCampaign(        
        address _campaignTokenContract, 
        address _rewardTokenContract, 
        uint256 _maxReferralsPerReferrer, 
        uint256 _rewardReferrer, 
        uint256 _rewardReferee, 
        uint256 _minCampaignTokenBalance,
        string memory _actionId) public payable returns (address) {
        // Make a clone contract
        address clone = Clones.clone(referralCampaign);
        ReferralCampaign(clone).initialize(msg.sender, 
            _campaignTokenContract, 
            _rewardTokenContract, 
            _maxReferralsPerReferrer, 
            _rewardReferrer, 
            _rewardReferee, 
            _minCampaignTokenBalance,
            worldID,
            appID,
            _actionId
            );

        // Emit an event containing the new campaign information
        Campaign memory campaign = Campaign(clone, msg.sender, 
            _campaignTokenContract, 
            _rewardTokenContract, 
            _maxReferralsPerReferrer, 
            _rewardReferrer, 
            _rewardReferee, 
            _minCampaignTokenBalance);

        campaignsForManager[msg.sender].push(campaign);
        emit CampaignCreated(msg.sender, clone);
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
