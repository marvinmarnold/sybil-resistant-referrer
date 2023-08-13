// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

import "./lzApp/NonblockingLzApp.sol";
import "./IERC20Or721.sol";

//Base 0xFeC9AD52dA5eCC6e7b18225Ec517F57276BFBFdF


/// @title A LayerZero example sending a cross chain message from a source chain to a destination chain to increment a counter
contract OmniCounter is NonblockingLzApp {
    uint public tokenBalance;

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}
   
    mapping(bytes32 => uint) userToToken;
    event RecievedMessage(address,address,uint,uint16);
    function _nonblockingLzReceive(uint16 _srcChainId, bytes memory, uint64, bytes memory _payload) internal override {
        address _user;
        address _tokenAddress;
        uint _tokenBalance;
        (_user,_tokenAddress,_tokenBalance)=abi.decode(_payload,(address,address,uint));
        
        // emit RecievedMessage(_user,_tokenAddress,_tokenBalance,_srcChainId);
        bytes32 crossHash = keccak256(abi.encodePacked(_user, _tokenAddress, _srcChainId));
        //Instead of storing here verify and transfer rewards
        userToToken[crossHash]=_tokenBalance;
    }

    function getBalance (address _user,address _tokenAddress,uint16 _srcChainId) public view returns(uint){
        bytes32 crossHash = keccak256(abi.encodePacked(_user, _tokenAddress, _srcChainId));
        return userToToken[crossHash];
    }

    function estimateFee(uint16 _dstChainId, bool _useZro, bytes calldata _adapterParams,address _tokenAddress) public view returns (uint nativeFee, uint zroFee) {
        bytes memory _payload = abi.encode(msg.sender,_tokenAddress);
        return lzEndpoint.estimateFees(_dstChainId, address(this), _payload, _useZro, _adapterParams);
    }

    function send(uint16 _dstChainId,address _tokenAddress) public payable {
        bytes memory _payload = abi.encode(msg.sender,_tokenAddress);
        _lzSend(_dstChainId, _payload, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }

    function setOracle(uint16 dstChainId, address oracle) external onlyOwner {
        uint TYPE_ORACLE = 6;
        // set the Oracle
        lzEndpoint.setConfig(lzEndpoint.getSendVersion(address(this)), dstChainId, TYPE_ORACLE, abi.encode(oracle));
    }

    function getOracle(uint16 remoteChainId) external view returns (address _oracle) {
        bytes memory bytesOracle = lzEndpoint.getConfig(lzEndpoint.getSendVersion(address(this)), remoteChainId, address(this), 6);
        assembly {
            _oracle := mload(add(bytesOracle, 32))
        }
    }
}