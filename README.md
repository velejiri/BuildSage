# BuildSage

BuildSage is a decentralized application that helps construction projects predict and manage delays using blockchain technology and weather data.

## Features

- SAGE Token: ERC20 token for the BuildSage ecosystem
- Delay Predictions: Create and manage predictions for construction project delays
- Weather Data Integration: Track and use weather data for delay predictions
- Reward Distribution: Incentivize accurate predictions with token rewards

## Smart Contracts

- `SAGEToken.sol`: ERC20 token contract with reward distribution capabilities
- `DelayPrediction.sol`: Contract for managing delay predictions
- `RewardDistribution.sol`: Contract for distributing rewards
- `PythIntegration.sol`: Contract for integrating with Pyth Network
- `BlockscoutIntegration.sol`: Contract for integrating with Blockscout

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration:
```
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
ETHERSCAN_API_KEY=your_etherscan_api_key
```

3. Compile contracts:
```bash
npx hardhat compile
```

4. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Web Interface

The project includes a web interface (`web3-interface.html`) for interacting with the smart contracts. To use it:

1. Serve the interface using a local web server:
```bash
python -m http.server 8000
```

2. Open `http://localhost:8000/web3-interface.html` in your browser
3. Connect your MetaMask wallet
4. Start interacting with the contracts!

## License

MIT
