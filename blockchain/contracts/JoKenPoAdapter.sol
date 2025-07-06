// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "../interfaces/IJoKenPo.sol";

contract JoKenPoAdapter  {
    IJoKenPo private joKenPo;
    address public immutable owner;

    constructor () {
        owner = msg.sender;
    }

    function getImplementationAddress() external view initialized onlyOwner returns(address)  {
        return address(joKenPo);
    }

    function getBalance() external view initialized returns(uint) {
        return joKenPo.getBalance();
    }

    function getResult() external view initialized returns(string memory) {
        return joKenPo.getResult();
    }

    function init(address newImplementation) external onlyOwner {
        require(newImplementation != address(0), "Endereco vazio nao permitido");

        joKenPo = IJoKenPo(newImplementation);
    }

    function getBid() external view initialized returns(uint256) {
        return joKenPo.getBid();
    }

    function getComission() external view initialized returns(uint8) {
        return joKenPo.getComission();
    }
    
    function getLeaderboard() external view initialized returns(JoKenPoLibrary.Player[] memory arr) {
        return joKenPo.getLeaderboard();
    }

    function setBid(uint256 newBid) external onlyOwner {
        return joKenPo.setBid(newBid);
    }

    function setComission(uint8 newCommission) external onlyOwner {
        return joKenPo.setComission(newCommission);
    }

    function play(JoKenPoLibrary.Options newChoice) external payable initialized {
        joKenPo.play{value: msg.value}(newChoice);
    }


    modifier initialized() {
        require(address(joKenPo) != address(0), "Contrato nao inicializado");
        _;
    }

    modifier onlyOwner() {
        require(owner == tx.origin, "A carteira nao possui esta permissao");
        _;
    }
}