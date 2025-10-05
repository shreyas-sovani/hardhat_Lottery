const { ethers } = require("hardhat");

async function main() {
  const lotteryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = Lottery.attach(lotteryAddress);

  const [deployer] = await ethers.getSigners();
  
  console.log("🔒 Closing Lottery...");
  console.log(`Manager: ${deployer.address}`);
  
  const tx = await lottery.connect(deployer).closeLottery();
  await tx.wait();
  
  console.log(`✅ Lottery closed successfully!`);
  console.log(`Transaction Hash: ${tx.hash}`);
  console.log(`Lottery Status: ${await lottery.getLotteryStatus()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
