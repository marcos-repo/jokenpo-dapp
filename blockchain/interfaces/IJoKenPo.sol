// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "../lib/JoKenPoLibrary.sol";

interface IJoKenPo {

    function getBid() external view returns(uint256);

    function getComission() external view returns(uint8);

    function getResult() external view returns(string memory);

    function setBid(uint256 newBid) external;

    function setComission(uint8 newCommission) external;    

    function getBalance() external view returns(uint);

    function play(JoKenPoLibrary.Options newChoice) external payable returns (string memory);

    function getLeaderboard() external view returns(JoKenPoLibrary.Player[] memory arr);
}   