# BuildSage Frontend - README

This is the frontend application for the BuildSage project, a construction delay prediction system built on Ethereum for the ETH Prague hackathon.

## Project Structure

```
buildsage-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── BlockscoutIntegration.tsx
│   │   ├── ConnectWallet.tsx
│   │   ├── LayerZeroIntegration.tsx
│   │   ├── OneInchIntegration.tsx
│   │   ├── PredictionForm.tsx
│   │   └── TokenInfo.tsx
│   ├── contracts/           # Contract ABIs and addresses
│   │   ├── abis/
│   │   │   ├── DelayPrediction.json
│   │   │   └── SAGEToken.json
│   │   └── addresses.json
│   ├── hooks/               # Custom React hooks
│   │   └── useContracts.ts
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles
│   └── index.tsx            # Entry point
└── package.json             # Dependencies and scripts
```

## Setup Instructions

1. **Update Contract Addresses**:
   - Edit `src/contracts/addresses.json` to use your deployed contract addresses
   - Replace the placeholder addresses with your actual deployed contract addresses

2. **Install Dependencies**:
   ```
   npm install
   ```
   or
   ```
   pnpm install
   ```

3. **Start Development Server**:
   ```
   npm run dev
   ```
   or
   ```
   pnpm run dev
   ```

4. **Build for Production**:
   ```
   npm run build
   ```
   or
   ```
   pnpm run build
   ```

## Features

- **Wallet Connection**: Connect with MetaMask or other Web3 wallets
- **Token Management**: View and transfer SAGE tokens
- **Delay Prediction**: Create and manage construction delay predictions
- **Partner Integrations**:
  - **Blockscout**: Transaction status checking and Merit points simulation
  - **1inch**: Token swap quote simulation
  - **LayerZero**: Cross-chain messaging simulation

## Customization

- To add real API integrations, update the respective components with actual API calls
- For production use, replace the simulated API calls with real implementations
- Add your own styling by modifying the CSS files

## Hackathon Prize Eligibility

This frontend is designed to demonstrate integration with:
- Blockscout Explorer and SDK
- 1inch API
- LayerZero cross-chain messaging

For full prize eligibility, ensure you complete the backend implementations and connect to the actual APIs with proper authentication.

## License

MIT
