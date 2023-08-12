// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { IWorldID } from "./IWorldID.sol";

//@notice A Referral Campaign Contract for storing referres and their respective referees
contract TestCampaign is Ownable, Initializable {
    function hello () public initializer {

    }
    function hellov (uint256 val) public initializer {
        require(val < 1, "Value can't be positive");
    }
}

