const { ethers } = require("hardhat");

async function main() {
  // Get the deployed contract address
  const lotteryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Get signers (accounts)
  const [deployer, player1, player2, player3] = await ethers.getSigners();
  
  console.log("🎰 Lottery Contract Interaction Script");
  console.log("=====================================");
  console.log(`Contract Address: ${lotteryAddress}`);
  console.log(`Deployer (Manager): ${deployer.address}`);
  console.log(`Player 1: ${player1.address}`);
  console.log(`Player 2: ${player2.address}`);
  console.log(`Player 3: ${player3.address}`);
  console.log("");

  // Connect to the deployed contract
  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = Lottery.attach(lotteryAddress);

  // Display initial state
  console.log("📊 Initial Lottery State:");
  console.log(`Manager: ${await lottery.getManager()}`);
  console.log(`Entry Amount: ${ethers.formatEther(await lottery.getEntryAmount())} ETH`);
  console.log(`Is Open: ${await lottery.getLotteryStatus()}`);
  console.log(`Current Round: ${await lottery.getCurrentRound()}`);
  console.log(`Total Players: ${await lottery.getTotalPlayers()}`);
  console.log(`Contract Balance: ${ethers.formatEther(await lottery.getBalance())} ETH`);
  console.log("");

  // Players enter the lottery
  console.log("🎫 Players entering the lottery...");
  
  const entryAmount = ethers.parseEther("0.01");
  
  // Player 1 enters
  console.log("Player 1 entering...");
  await lottery.connect(player1).enterLottery({ value: entryAmount });
  console.log(`✅ Player 1 entered. Total players: ${await lottery.getTotalPlayers()}`);
  
  // Player 2 enters
  console.log("Player 2 entering...");
  await lottery.connect(player2).enterLottery({ value: entryAmount });
  console.log(`✅ Player 2 entered. Total players: ${await lottery.getTotalPlayers()}`);
  
  // Player 3 enters
  console.log("Player 3 entering...");
  await lottery.connect(player3).enterLottery({ value: entryAmount });
  console.log(`✅ Player 3 entered. Total players: ${await lottery.getTotalPlayers()}`);
  
  console.log(`Contract Balance: ${ethers.formatEther(await lottery.getBalance())} ETH`);
  console.log("");

  // Manager closes the lottery
  console.log("🔒 Manager closing the lottery...");
  await lottery.connect(deployer).closeLottery();
  console.log(`✅ Lottery closed. Status: ${await lottery.getLotteryStatus()}`);
  console.log("");

  // Pick winner
  console.log("🎲 Picking winner...");
  const tx = await lottery.connect(deployer).transferPot();
  const receipt = await tx.wait();
  
  console.log(`✅ Winner selected!`);
  console.log(`Winner: ${await lottery.getLastWinner()}`);
  console.log(`Winner Index: ${await lottery.getWinnerIndex()}`);
  console.log(`New Round: ${await lottery.getCurrentRound()}`);
  console.log(`Contract Balance: ${ethers.formatEther(await lottery.getBalance())} ETH`);
  console.log(`Lottery Status: ${await lottery.getLotteryStatus()}`);
  console.log(`Total Players: ${await lottery.getTotalPlayers()}`);
  console.log("");

  // Show transaction details
  console.log("📋 Transaction Details:");
  console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
  console.log(`Transaction Hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
