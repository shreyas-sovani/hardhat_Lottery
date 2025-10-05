# 🎰 Hardhat Lottery

A simple blockchain lottery built with Hardhat! Players enter with 0.01 ETH, and one lucky winner takes the whole pot. Perfect for learning smart contracts and having some fun.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Git

### Setup
1. **Clone and install:**
   ```bash
   git clone <your-repo-url>
   cd hardhat_lottery
   npm install
   ```

2. **Start local blockchain:**
   ```bash
   npm run node
   ```
   Keep this running in Terminal 1! 🟢

3. **Deploy the contract:**
   ```bash
   npm run deploy
   ```
   Run this in Terminal 2 (new terminal window)

## 🎮 How to Play

### Basic Workflow
```bash
# Check lottery status
npm run status

# Players enter (cycles through accounts automatically)
npm run enter    # Player 1 enters
npm run enter    # Player 2 enters  
npm run enter    # Player 3 enters
npm run enter    # Player 4 enters
npm run enter    # Player 5 enters
npm run enter    # Player 1 enters again (cycles back)

# Close lottery (manager only)
npm run close

# Pick winner and start new round
npm run pick-winner
```

### Full Demo
Want to see everything in action? Run the complete demo:
```bash
npm run interact
```

## 🎯 Available Commands

| Command | What it does |
|---------|-------------|
| `npm run node` | Start local blockchain |
| `npm run deploy` | Deploy lottery contract |
| `npm run status` | Check lottery state |
| `npm run enter` | Enter lottery (auto-cycles players) |
| `npm run close` | Close lottery (manager only) |
| `npm run pick-winner` | Pick winner & start new round |
| `npm run interact` | Full demo workflow |
| `npm test` | Run tests |

## 🎲 How It Works

1. **Enter**: Players send 0.01 ETH to enter the lottery
2. **Close**: Manager closes entries (no more players can join)
3. **Pick Winner**: Manager randomly selects a winner
4. **Win**: Winner gets the entire pot! 🎉
5. **Reset**: Lottery automatically opens for the next round

## 🔧 Technical Details

- **Entry Fee**: 0.01 ETH
- **Randomness**: Uses `block.prevrandao` (not secure for production!)
- **Accounts**: 5 test accounts cycle automatically
- **Network**: Local Hardhat network

## 🧪 Testing

Run the test suite:
```bash
npm test
```

All tests should pass! ✅

## 🎪 Interactive Console

Want to play around manually? Use the Hardhat console:
```bash
npx hardhat console --network localhost
```

Then copy commands from `console-commands.js` to interact directly with the contract.

## 🚨 Important Notes

- This is for **learning/testing only** - don't use real money!
- The randomness is **not secure** for production use
- Always test thoroughly before deploying to mainnet
- Keep your private keys safe! 🔐

## 🎉 Have Fun!

This lottery is perfect for:
- Learning smart contract development
- Understanding blockchain interactions
- Testing Hardhat features
- Having fun with friends (on testnet!)

**Happy coding!** 🚀

---

*Built with ❤️ using Hardhat*