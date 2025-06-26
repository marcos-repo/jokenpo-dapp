// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "../interfaces/IJoKenPo.sol";

contract JoKenPoAdapter  {
    IJoKenPo private joKenPo;
    address public immutable owner;

    constructor () {
        owner = msg.sender;
    }

    function getAddress() external view upgraded onlyOwner returns(address)  {
        return address(joKenPo);
    }

    function getBalance() external view returns(uint) {
        return joKenPo.getBalance();
    }

    function getResult() external view upgraded returns(string memory) {
        return joKenPo.getResult();
    }

    function upgrade(address newImplementation) external onlyOwner {
        require(newImplementation != address(0), "Endereco vazio nao permitido");

        joKenPo = IJoKenPo(newImplementation);
    }

    function getBid() external view returns(uint256) {
        return joKenPo.getBid();
    }

    function getComission() external view returns(uint8) {
        return joKenPo.getComission();
    }

    function getLeaderboard() external view returns(JoKenPoLibrary.Player[] memory arr) {
        return joKenPo.getLeaderboard();
    }


    function play(JoKenPoLibrary.Options newChoice) external payable {
        joKenPo.play{value: msg.value}(newChoice);
    }


    modifier upgraded() {
        require(address(joKenPo) != address(0), "Contrato nao atualizado");
        _;
    }

    modifier onlyOwner() {
        require(owner == tx.origin, "A carteira nao possui esta permissao");
        _;
    }
}