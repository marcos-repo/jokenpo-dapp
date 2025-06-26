// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "../interfaces/IJoKenPo.sol";

contract JoKenPo is IJoKenPo {

    JoKenPoLibrary.Options private choice1 = JoKenPoLibrary.Options.NONE;
    address private player1; 
    string private result = "";
    uint256 private bid = 0.01 ether;
    uint8 private commission = 10; //em percentual

    address payable private immutable owner;

    JoKenPoLibrary.Player[] public players;

    constructor(){
        owner = payable(msg.sender);
    }

    function getBid() external view returns(uint256) {
        return bid;
    }

    function getComission() external view returns(uint8) {
        return commission;
    }

    function getResult() external view returns(string memory) {
        return result;
    }

    function setBid(uint256 newBid) external onlyOwner {
        require(player1 == address(0), "Voce nao pode alterar o valor de aposta com um jogo em andamento");
        bid = newBid;
    }

    

    function setComission(uint8 newCommission) external onlyOwner {
        require(player1 == address(0), "Voce nao pode alterar o valor da comissao com um jogo em andamento");
        commission = newCommission;
    }

    function updateWinner(address winner) private {
        for (uint i = 0; i < players.length; i++) 
        {
            if(players[i].wallet == winner) {
                players[i].wins++;
                return;
            }
            
        }

        players.push(JoKenPoLibrary.Player(winner, 1));
    }

    function finishGame(string memory newResult, address winner) private {
        address contractAddress = address(this);
        payable(winner).transfer((contractAddress.balance / 100) * (100 - commission));
        owner.transfer(contractAddress.balance);

        updateWinner(winner);

        result = newResult;
        player1 = address(0);
        choice1 = JoKenPoLibrary.Options.NONE;
    }

    function getBalance() external view onlyOwner returns(uint) {
        return address(this).balance;
    }

    function play(JoKenPoLibrary.Options newChoice) external payable {
        require(tx.origin != owner, "O proprietario do contrato nao pode jogar");
        require(newChoice != JoKenPoLibrary.Options.NONE, "Jogada invalida");
        require(player1 != tx.origin, "Aguarde a jogada do outro jogador");
        require(msg.value >= bid, "Valor da aposta insuficiente");

        if(choice1 == JoKenPoLibrary.Options.NONE) {
            player1 = tx.origin;
            choice1 = newChoice;
            result = "O jogador 1 fez sua jogada. Aguardando o jogador 2";
        }
        else if (choice1 == JoKenPoLibrary.Options.ROCK && newChoice == JoKenPoLibrary.Options.SCISSORS) {
            finishGame("Pedra quebra Tesoura. Jogador 1 venceu", player1);
        }
        else if (choice1 == JoKenPoLibrary.Options.PAPER && newChoice == JoKenPoLibrary.Options.ROCK) {
            finishGame("Papel embrulha Pedra. Jogador 1 venceu", player1);
        }
        else if (choice1 == JoKenPoLibrary.Options.SCISSORS && newChoice == JoKenPoLibrary.Options.PAPER) {
            finishGame("Tesoura corta Papel. Jogador 1 venceu", player1);
        }
        else if (choice1 == JoKenPoLibrary.Options.SCISSORS && newChoice == JoKenPoLibrary.Options.ROCK) {
            finishGame("Pedra quebra Tesoura. Jogador 2 venceu", tx.origin);
        }
        else if (choice1 == JoKenPoLibrary.Options.ROCK && newChoice == JoKenPoLibrary.Options.PAPER) {
            finishGame("Papel embrulha Pedra. Jogador 2 venceu", tx.origin);
        }
        else if (choice1 == JoKenPoLibrary.Options.PAPER && newChoice == JoKenPoLibrary.Options.SCISSORS) {
            finishGame("Tesoura corta Papel. Jogador 2 venceu", tx.origin);
        }
        else {
            result = "Empate entre os dois jogadores. O Premio foi dobrado";
            player1 = address(0);
            choice1 = JoKenPoLibrary.Options.NONE;
        }
    }

    function getLeaderboard() external view returns(JoKenPoLibrary.Player[] memory arr) {
        if(players.length < 2) return players;

        arr = new JoKenPoLibrary.Player[](players.length);
        for(uint256 i = 0; i< players.length; i++)
            arr[i] = players[i];

        for (uint256 i = 0; i < players.length - 1; i++) {
            for (uint j = 0; j < arr.length; j++) {
                if(arr[i].wins < arr[j].wins) {
                    JoKenPoLibrary.Player memory change = arr[i];
                    arr[i] = arr[j];
                    arr[j] = change;
                }
            }
        }
    }

    modifier onlyOwner() {
        require(owner == tx.origin, "A carteira nao possui esta permissao");
        _;
    }
}