const { assert, expect } = require("chai");
const { ignition, ethers } = require("hardhat");

describe("Lottery Unit Tests", function () {
  let lottery, deployer, player1, player2;

  beforeEach(async function () {
    [deployer, player1, player2] = await ethers.getSigners();
    const lotteryModule = require("../ignition/modules/lottery.js");
    const deployment = await ignition.deploy(lotteryModule);
    lottery = deployment.lottery;
  });

  describe("Constructor", function () {
    it("Initializes the lottery correctly", async function () {
      assert.equal(await lottery.getManager(), deployer.address);
      assert.equal(
        await lottery.getEntryAmount(),
        ethers.parseEther("0.01")
      );
      assert.equal(await lottery.getLotteryStatus(), true);
      assert.equal(await lottery.getCurrentRound(), 1);
      assert.equal(await lottery.getTotalPlayers(), 0);
    });
  });

  describe("Enter lottery", function () {
    it("Allows players to enter with correct amount", async function () {
      await lottery.connect(player1).enterLottery({ value: ethers.parseEther("0.01") });
      assert.equal(await lottery.getTotalPlayers(), 1);
      assert.equal(await lottery.players(0), player1.address);
    });

    it("Rejects entry with incorrect amount", async function () {
      await expect(
        lottery.connect(player1).enterLottery({ value: ethers.parseEther("0.02") })
      ).to.be.revertedWith("Incorrect entry amount");
    });

    it("Rejects entry when lottery is closed", async function () {
      await lottery.closeLottery();
      await expect(
        lottery.connect(player1).enterLottery({ value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Lottery is not open");
    });

    it("Allows multiple players to enter", async function () {
      await lottery.connect(player1).enterLottery({ value: ethers.parseEther("0.01") });
      await lottery.connect(player2).enterLottery({ value: ethers.parseEther("0.01") });
      assert.equal(await lottery.getTotalPlayers(), 2);
    });
  });

  describe("Manager functions", function () {
    it("Only manager can close lottery", async function () {
      await lottery.connect(player1).enterLottery({ value: ethers.parseEther("0.01") });
      
      // Manager can close
      await lottery.closeLottery();
      assert.equal(await lottery.getLotteryStatus(), false);
      
      // Non-manager cannot close
      await expect(
        lottery.connect(player1).closeLottery()
      ).to.be.revertedWith("Only manager can call this function");
    });

    it("Only manager can open lottery", async function () {
      await lottery.closeLottery();
      
      // Manager can open
      await lottery.openLottery();
      assert.equal(await lottery.getLotteryStatus(), true);
      
      // Non-manager cannot open
      await expect(
        lottery.connect(player1).openLottery()
      ).to.be.revertedWith("Only manager can call this function");
    });

    it("Only manager can pick winner", async function () {
      await lottery.connect(player1).enterLottery({ value: ethers.parseEther("0.01") });
      await lottery.closeLottery();
      
      // Manager can pick winner
      await lottery.transferPot();
      assert.notEqual(await lottery.getLastWinner(), ethers.ZeroAddress);
      
      // Reset for next test
      await lottery.connect(player2).enterLottery({ value: ethers.parseEther("0.01") });
      await lottery.closeLottery();
      
      // Non-manager cannot pick winner
      await expect(
        lottery.connect(player1).transferPot()
      ).to.be.revertedWith("Only manager can call this function");
    });
  });

  describe("Pick winner", function () {
    it("Picks winner and transfers pot", async function () {
      const initialBalance = await ethers.provider.getBalance(player1.address);
      
      await lottery.connect(player1).enterLottery({ value: ethers.parseEther("0.01") });
      await lottery.connect(player2).enterLottery({ value: ethers.parseEther("0.01") });
      
      const lotteryBalance = await lottery.getBalance();
      assert.equal(lotteryBalance.toString(), ethers.parseEther("0.02").toString());
      
      await lottery.closeLottery();
      await lottery.transferPot();
      
      // Check that winner was set
      const winner = await lottery.getLastWinner();
      assert.notEqual(winner, ethers.ZeroAddress);
      
      // Check that lottery resets for next round
      assert.equal(await lottery.getLotteryStatus(), true);
      assert.equal(await lottery.getTotalPlayers(), 0);
      assert.equal(await lottery.getCurrentRound(), 2);
    });

    it("Cannot pick winner when lottery is open", async function () {
      await lottery.connect(player1).enterLottery({ value: ethers.parseEther("0.01") });
      
      await expect(
        lottery.transferPot()
      ).to.be.revertedWith("Lottery is still open");
    });

    it("Cannot pick winner with no players", async function () {
      await lottery.closeLottery();
      
      await expect(
        lottery.transferPot()
      ).to.be.revertedWith("No players in the lottery");
    });
  });

  describe("Getter functions", function () {
    it("Returns correct lottery information", async function () {
      assert.equal(await lottery.getManager(), deployer.address);
      assert.equal(await lottery.getEntryAmount(), ethers.parseEther("0.01"));
      assert.equal(await lottery.getLotteryStatus(), true);
      assert.equal(await lottery.getCurrentRound(), 1);
      assert.equal(await lottery.getTotalPlayers(), 0);
      assert.equal(await lottery.getBalance(), 0);
      assert.equal(await lottery.getLastWinner(), ethers.ZeroAddress);
    });
  });
});
