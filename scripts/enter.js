const { ethers } = require("hardhat");

async function main() {
  const lotteryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = Lottery.attach(lotteryAddress);

  // Get all available accounts
  const [deployer, player1, player2, player3, player4, player5] = await ethers.getSigners();
  const players = [player1, player2, player3, player4, player5];
  
  // Cycle through accounts based on current player count
  const currentPlayerCount = await lottery.getTotalPlayers();
  const playerIndex = Number(currentPlayerCount) % players.length;
  const currentPlayer = players[playerIndex];
  
  console.log(`🎫 Player ${playerIndex + 1} entering lottery...`);
  console.log(`Address: ${currentPlayer.address}`);
  
  const entryAmount = ethers.parseEther("0.01");
  
  try {
    const tx = await lottery.connect(currentPlayer).enterLottery({ value: entryAmount });
    await tx.wait();
    
    console.log(`✅ Successfully entered!`);
    console.log(`Total Players: ${await lottery.getTotalPlayers()}`);
    console.log(`Contract Balance: ${ethers.formatEther(await lottery.getBalance())} ETH`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });