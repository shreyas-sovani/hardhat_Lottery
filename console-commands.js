// Hardhat Console Commands for Lottery Contract
// Run: npx hardhat console --network localhost

// 1. Get contract instance
const lotteryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const Lottery = await ethers.getContractFactory("Lottery");
const lottery = Lottery.attach(lotteryAddress);

// 2. Get accounts
const [deployer, player1, player2, player3] = await ethers.getSigners();

// 3. Check status
await lottery.getLotteryStatus(); // true/false
await lottery.getTotalPlayers(); // number
await lottery.getBalance(); // contract balance
await lottery.getCurrentRound(); // round number
await lottery.getLastWinner(); // last winner address

// 4. Enter lottery (as player1)
await lottery.connect(player1).enterLottery({ value: ethers.parseEther("0.01") });

// 5. Close lottery (as manager)
await lottery.connect(deployer).closeLottery();

// 6. Pick winner (as manager)
await lottery.connect(deployer).transferPot();

// 7. Open lottery (as manager)
await lottery.connect(deployer).openLottery();

// 8. Get player addresses
await lottery.players(0); // first player
await lottery.players(1); // second player

// 9. Format ether values
ethers.formatEther(await lottery.getBalance()); // convert wei to ETH

// 10. Check if lottery is open
if (await lottery.getLotteryStatus()) {
  console.log("Lottery is open - players can enter");
} else {
  console.log("Lottery is closed - no new entries");
}
