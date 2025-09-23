const { assert, expect } = require("chai");
const { ignition, ethers } = require("hardhat");

describe("Lottery Unit Tests", async function () {
  let lottery, deployer;
  beforeEach(async function () {
    [deployer] = await ethers.getSigners();
    const lotteryModule = require("../../ignition/modules/lottery");
    const deployment = await ignition.deploy(lotteryModule);
    lottery = deployment.lottery;
  });

});
