import {
  loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("JoKenPoAdapter Tests", function () {

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

    const JoKenPoAdapter = await hre.ethers.getContractFactory("JoKenPoAdapter");
    const joKenPoAdapter = await JoKenPoAdapter.deploy();

    return { joKenPo, joKenPoAdapter, owner, player1, player2 };
  }


    it("Should get implementation address", async function () {
      const { joKenPo, joKenPoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

      const address = await joKenPo.getAddress();

      await joKenPoAdapter.init(address);

      const implementationAddress = await joKenPoAdapter.getImplementationAddress()

      expect(implementationAddress).eq(address);
    });

    it("Should get bid", async function () {
      const { joKenPo, joKenPoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

      await joKenPoAdapter.init(joKenPo);

      const bid = await joKenPoAdapter.getBid();
      expect(bid).eq(DEFAULT_BID);
    });

    it("Should get NOT bid(initialized)", async function () {
      const { joKenPo, joKenPoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

      await expect(joKenPoAdapter.getBid())
        .to
        .be
        .revertedWith("Contrato nao inicializado");
    });

    it("Should get comission", async function () {
      const { joKenPo, joKenPoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

      await joKenPoAdapter.init(joKenPo);

      const comission = await joKenPoAdapter.getComission();
      expect(comission).eq(10);
    });

    it("Should get NOT comission(initialized)", async function () {
      const { joKenPo, joKenPoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

      await expect(joKenPoAdapter.getComission())
        .to
        .be
        .revertedWith("Contrato nao inicializado");
    });

    it("Should get NOT upgrade(permission)", async function () {
      const { joKenPo, joKenPoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

      const instance = joKenPoAdapter.connect(player1);

      await expect(instance.init(joKenPo))
        .to
        .be
        .revertedWith("A carteira nao possui esta permissao");
    });

    it("Should get NOT upgrade(invalid address)", async function () {
      const { joKenPo, joKenPoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

      await expect(joKenPoAdapter.init(ethers.ZeroAddress))
        .to
        .be
        .revertedWith("Endereco vazio nao permitido");
    });

    it("Should play alone by adapter", async function () {
      const { joKenPo, joKenPoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);
      
      await joKenPoAdapter.init(joKenPo);

      const instance = joKenPoAdapter.connect(player1);
      await instance.play(Options.PAPER, {value: DEFAULT_BID});

      const result = await instance.getResult();
      expect(result).eq("O jogador 1 fez sua jogada. Aguardando o jogador 2");
    });

    it("Should play along by adapter", async function () {
      const { joKenPo, joKenPoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);
      
      await joKenPoAdapter.init(joKenPo);

      const instance1 = joKenPoAdapter.connect(player1);
      await instance1.play(Options.PAPER, {value: DEFAULT_BID});

      const instance2 = joKenPoAdapter.connect(player2);
      await instance2.play(Options.ROCK, {value: DEFAULT_BID});

      const result = await instance2.getResult();
      expect(result).eq("Papel embrulha Pedra. Jogador 1 venceu");
    });
});
