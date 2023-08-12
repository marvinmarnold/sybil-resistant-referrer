// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

import "./lzApp/NonblockingLzApp.sol";
import "./IERC20Or721.sol";



/// @title A LayerZero example sending a cross chain message from a source chain to a destination chain to increment a counter
contract OmniCounter is NonblockingLzApp {
    address public campaignToken;
    uint public tokenBalance;

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}

    function _nonblockingLzReceive(uint16 _srcChainId, bytes memory, uint64, bytes memory _payload) internal override {
        (address _referee,address _token)=abi.decode(_payload,(address,address));
        tokenBalance = IERC20Or721(_token).balanceOf(_referee);
        // bytes memory _payloadNew = abi.encode(_tokenBalance);
        // _lzSend(_srcChainId, _payloadNew, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }

    function estimateFee(uint16 _dstChainId, bool _useZro, bytes calldata _adapterParams) public view returns (uint nativeFee, uint zroFee) {
        uint _tokenBalance = IERC20Or721(0x477f6fBbEB9D7BE6926a591b173d05dAdf9ED022).balanceOf(msg.sender);
        bytes memory _payload = abi.encode(_tokenBalance);
        return lzEndpoint.estimateFees(_dstChainId, address(this), _payload, _useZro, _adapterParams);
    }

    function send(uint16 _dstChainId) public payable {
        uint _tokenBalance = IERC20Or721(0x477f6fBbEB9D7BE6926a591b173d05dAdf9ED022).balanceOf(msg.sender);
        bytes memory _payload = abi.encode(_tokenBalance);
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