const { ethers } = require("hardhat");

async function main() {
  const lotteryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = Lottery.attach(lotteryAddress);

  const [deployer] = await ethers.getSigners();
  
  console.log("🎲 Picking Winner...");
  console.log(`Manager: ${deployer.address}`);
  console.log(`Players: ${await lottery.getTotalPlayers()}`);
  console.log(`Pot: ${ethers.formatEther(await lottery.getBalance())} ETH`);
  
  const tx = await lottery.connect(deployer).transferPot();
  const receipt = await tx.wait();
  
  console.log(`✅ Winner selected!`);
  console.log(`Winner: ${await lottery.getLastWinner()}`);
  console.log(`Winner Index: ${await lottery.getWinnerIndex()}`);
  console.log(`New Round: ${await lottery.getCurrentRound()}`);
  console.log(`Transaction Hash: ${tx.hash}`);
  console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
