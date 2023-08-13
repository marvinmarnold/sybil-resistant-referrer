// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { IWorldID } from "./IWorldID.sol";

//@notice A Referral Campaign Contract for storing referres and their respective referees
contract TestCampaign is Ownable, Initializable {
    event Welcomed(string);
    address campaignManager;
    address campaignTokenContract;
    uint256 helloTimes;
// @dev Storing referee's per referrer
    mapping(address => uint256) internal numReferralsByReferrer;
    event ReferrerAdded(address);

    function initialize (
        address _manager,
        address _campaignTokenContract
        ) public initializer {
        campaignManager = _manager;
        campaignTokenContract = _campaignTokenContract;
        helloTimes = 1;
    }

    function hello(uint256 merkle, uint256[1] calldata proof) public returns(
        string memory
        ) {
        helloTimes = merkle + proof[0];
        emit Welcomed("sup boss");
        return "sup boss";
    }

    function hello2(uint256 root, uint256 nullifierHash, uint256[1] calldata proof) public {
        //@dev Instead of require, verification to be done by worldcoin
        require(numReferralsByReferrer[msg.sender] == 0, "Referrer already registered.");

        // verifyAndExecute(signal, root, nullifierHash, proof);

        // @dev Initiating the referrer to one to distinguish between already registered with no referees from the ones who have not registered.
        numReferralsByReferrer[msg.sender] = 1;
        emit ReferrerAdded(msg.sender);
    }

    function hellov(uint256 val) public {
        require(val < 1, "Value can't be positive");
    }
}

