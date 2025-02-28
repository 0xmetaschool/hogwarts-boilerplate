# 🏰 Hogwarts House NFT DApp

A decentralized application (DApp) that allows users to mint NFTs representing their Hogwarts house membership. Each user can mint a unique NFT corresponding to one of the four Hogwarts houses: Gryffindor, Hufflepuff, Ravenclaw, or Slytherin.

## ✨ Features

- **House NFT Minting**: Users can mint a unique NFT representing their Hogwarts house
- **One NFT Per Address**: Each Ethereum address can mint only one house NFT
- **Custom Naming**: Users can associate their name with their minted NFT
- **House Verification**: Users can verify which house an address belongs to
- **Interactive UI**: Beautiful and responsive React-based user interface
- **Web3 Integration**: Seamless interaction with Ethereum blockchain

## 🛠 Technology Stack

- **Frontend**:
  - React.js (v19.0.0)
  - Web3.js (v4.16.0)
  - Lottie React for animations
  - Use-sound for audio effects

- **Smart Contract**:
  - Solidity (v0.8.8)
  - OpenZeppelin Contracts
    - ERC721URIStorage
    - Ownable

- **NFT Storage**:
  - IPFS via Pinata

## 🔧 Prerequisites

- Node.js (v14 or higher)
- MetaMask wallet extension installed in your browser
- Some test ETH in your wallet for minting NFTs

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hogwarts-dapp-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 📝 Smart Contract Details

The `HogwartsNFT` smart contract is deployed on the Ethereum network and includes the following main features:

- ERC721 standard implementation
- House assignment and tracking
- One-time minting restriction
- Name association with NFTs
- Owner-only minting capabilities

## 🎨 NFT Metadata

The NFT images and metadata are stored on IPFS through Pinata, ensuring decentralized and permanent storage of your Hogwarts house badges.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
