const { ethers } = require("hardhat");

async function main() {
  const lotteryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = Lottery.attach(lotteryAddress);

  console.log("📊 Current Lottery Status:");
  console.log("=========================");
  console.log(`Manager: ${await lottery.getManager()}`);
  console.log(`Entry Amount: ${ethers.formatEther(await lottery.getEntryAmount())} ETH`);
  console.log(`Is Open: ${await lottery.getLotteryStatus()}`);
  console.log(`Current Round: ${await lottery.getCurrentRound()}`);
  console.log(`Total Players: ${await lottery.getTotalPlayers()}`);
  console.log(`Contract Balance: ${ethers.formatEther(await lottery.getBalance())} ETH`);
  console.log(`Last Winner: ${await lottery.getLastWinner()}`);
  
  if (await lottery.getTotalPlayers() > 0) {
    console.log("\n🎫 Current Players:");
    for (let i = 0; i < await lottery.getTotalPlayers(); i++) {
      console.log(`  ${i}: ${await lottery.players(i)}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
