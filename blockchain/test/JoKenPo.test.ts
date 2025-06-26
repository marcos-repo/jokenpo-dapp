import {
  loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("JoKenPo Tests", function () {

  enum Options { 
        NONE,
        ROCK, 
        PAPER, 
        SCISSORS 
    }
  
  const DEFAULT_BID = hre.ethers.parseEther("0.01");

  async function deployFixture() {
    const [owner, player1, player2] = await hre.ethers.getSigners();

    const JoKenPo = await hre.ethers.getContractFactory("JoKenPo");
    const joKenPo = await JoKenPo.deploy();

    return { joKenPo: joKenPo, owner, player1, player2 };
  }

  describe("Deployment", async function () {
    it("Should get leaderboard", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, {value: DEFAULT_BID});

      const player2Instance = joKenPo.connect(player2);
      await player2Instance.play(Options.ROCK, {value: DEFAULT_BID});

      const leaderboard = await joKenPo.getLeaderboard();

      expect(leaderboard.length).greaterThan(0);
      expect(leaderboard[0].wallet).eq(player1.address);
      expect(leaderboard[0].wins).eq(1);
    });

    it("Should set bid", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const newBid = hre.ethers.parseEther("0.02");

      await joKenPo.setBid(newBid);

      const bid = await joKenPo.getBid();

      expect(bid).eq(newBid);
    });

    it("Should NOT set bid(permission)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const newBid = hre.ethers.parseEther("0.02");

      const player1Instance = joKenPo.connect(player1);

      await expect(player1Instance.setBid(newBid))
            .to
            .be
            .revertedWith("A carteira nao possui esta permissao");
    });

    it("Should NOT set bid(game in progress)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, {value: DEFAULT_BID});

      const newBid = hre.ethers.parseEther("0.02");

      await expect(joKenPo.setBid(newBid))
            .to
            .be
            .revertedWith("Voce nao pode alterar o valor de aposta com um jogo em andamento");
    });

    it("Should set commission", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      await joKenPo.setComission(20);

      const commission = await joKenPo.getComission();

      expect(commission).eq(20);
    });

    it("Should NOT set commission(permission)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);
      const player1Instance = joKenPo.connect(player1);

      await expect(player1Instance.setComission(10))
            .to
            .be
            .revertedWith("A carteira nao possui esta permissao");
    });

    it("Should NOT set bid(game in progress)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, {value: DEFAULT_BID});

      await expect(joKenPo.setComission(20))
            .to
            .be
            .revertedWith("Voce nao pode alterar o valor da comissao com um jogo em andamento");
    });

    



    it("Should play alone", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, {value: DEFAULT_BID});

      const result = await joKenPo.getResult();

      expect(result).eq("O jogador 1 fez sua jogada. Aguardando o jogador 2");
    });

    it("Should play along", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, {value: DEFAULT_BID});

      const player2Instance = joKenPo.connect(player2);
      await player2Instance.play(Options.ROCK, {value: DEFAULT_BID});

      const result = await joKenPo.getResult();

      expect(result).eq("Papel embrulha Pedra. Jogador 1 venceu");
    });
    
    it("Should NOT play alone(owner)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, {value: DEFAULT_BID});

      await expect(joKenPo.play(Options.PAPER, {value: DEFAULT_BID}))
            .to
            .be
            .revertedWith("O proprietario do contrato nao pode jogar");
    });

    it("Should NOT play(wrong option)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);

      await expect(player1Instance.play(Options.NONE, {value: DEFAULT_BID}))
            .to
            .be
            .revertedWith("Jogada invalida");
    });

    it("Should NOT play(twice)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, {value: DEFAULT_BID});

      await expect(player1Instance.play(Options.ROCK, {value: DEFAULT_BID}))
            .to
            .be
            .revertedWith("Aguarde a jogada do outro jogador");
    });

    it("Should NOT play(invalid bid)", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

      const player1Instance = joKenPo.connect(player1);

      await expect(player1Instance.play(Options.PAPER, {value: DEFAULT_BID - 1000n}))
            .to
            .be
            .revertedWith("Valor da aposta insuficiente");
    });

  });
});
