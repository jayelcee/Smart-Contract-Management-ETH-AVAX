# Token Wallet

A decentralized application that integrates a Solidity smart contract with a React-based frontend, allowing users to manage tokens seamlessly.

## Description

The Token Wallet project features a smart contract written in Solidity, enabling functionalities like minting, transferring, and resetting token balances. The React frontend, built with ethers.js, allows users to interact with the smart contract via MetaMask, providing a user-friendly interface for managing token balances.

Video Demo: https://www.loom.com/share/92bc56a19631425da6236d5c19fa2d24

## Getting Started

### Prerequisites

To run this project, you need:

- [Node.js](https://nodejs.org/) installed
- MetaMask extension set up in your browser

### Installation and Setup

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

### Running the Application

1. Start a local Ethereum blockchain (e.g., using Hardhat):

   ```bash
   npx hardhat node
   ```

2. Compile and deploy the smart contract using an Ethereum development framework like Hardhat:

   ```bash
   npx hardhat compile
   npx hardhat run --network localhost scripts/deploy.js
   ```

3. Update the frontend with the deployed contract's address. Locate the `contractAddress` variable in the frontend code and replace its value with the actual address of the deployed contract.

4. Launch the React frontend:

   ```bash
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to use the Token Wallet.

6. Connect MetaMask to your local blockchain network.

## Features

- **Mint Tokens**: Allows the contract owner to create new tokens and add them to their wallet balance.
- **Transfer Tokens**: Enables users to send tokens to other addresses if they have sufficient balance.
- **Check Balances**: Displays token balances for the logged-in user and other recipients.
- **Reset Balances**: Lets the owner reset all token balances to zero.

## Troubleshooting

If you experience any issues, try the following:

- Ensure MetaMask is connected to the correct Ethereum network.
- Confirm that the contract is properly deployed and that the contract address in the frontend matches the deployed contract's address.
- Check the browser's developer console for errors or warnings during interaction.
- Reinstall dependencies using `npm install` if issues persist.
- Clear activity tab data in MetaMask

## License

This project is licensed under the MIT License.
