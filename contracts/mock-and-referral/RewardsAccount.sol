// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardsAccount is Ownable {
    IERC20 public rtcToken;
    address public campaignReferralContract;

    constructor(address _rtcTokenAddress, address _campaignReferralContract) {
        require(_rtcTokenAddress != address(0), "_rtcTokenAddress should be valid");
        rtcToken = IERC20(_rtcTokenAddress);

        require(_campaignReferralContract != address(0), "_campaignReferralContract address should be valid");
        campaignReferralContract = _campaignReferralContract;
    }

    function approveRewardWithdrawal(uint256 _totalAmount) external onlyOwner {
        require(_totalAmount > 0, "Amount must be greater than 0");
        require(rtcToken.balanceOf(address(this)) > _totalAmount, "Balance must be greater than _totalAmount");
        rtcToken.approve(campaignReferralContract, _totalAmount);
    }
}