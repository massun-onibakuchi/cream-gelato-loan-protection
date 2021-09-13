# Cream Gelato Loan Saver
Automated Health Factor Maintenance Proof of Concept

Cream Fi and Gelato Network integration + frontend

Ref: [loan saver contracts](https://github.com/massun-onibakuchi/cream-gelato-contracts)

Demo:[YouTube](https://www.youtube.com/watch?v=vRnwgaruF7s)
## Concept
CreamFi users can specify their Minimum Health Factor and their Wanted Health Factor. Once a user’s Health Factor on CreamFi drops below their specified minimum threshold, Gelato will rebalance the user’s debt position on Cream, to attain the user’s specified Wanted Health Factor again. The bots achieve this on behalf of the user by swapping some of the user’s collateral for debt token and then repaying some of that debt. The bots swap the user’s collateral on Uniswap V2. This repo use Gelato PokeMe for autometed task.

This repo use [ 🏗 Scaffold-ETH](https://github.com/scaffold-eth/scaffold-eth/tree/nextjs-typescript)

## Start up the Hardhat Network

```
yarn
```

```
yarn chain
```

Here we just install the npm project's dependencies, and by running `yarn chain` we spin up an instance of Hardhat Network that you can connect to using MetaMask. In a different terminal in the same directory, run:

```bash
yarn deploy
```

This will deploy the contract to Hardhat Network and then publish artifacts abi and addresses. After this completes run:

```bash
yarn dev
```

This will start up the Next.js development server and your site will be available at http://localhost:3000/

To interact with the local contract, be sure to switch your MetaMask Network to `Localhost 8545`

To set up cream and gelato environments, run the following command:
```bash
cd packages/hardhat/ && yarn hardhat run scripts/setup.ts
```
This will let an account deposit a token to Cream fi and borrow the other token. At this time, a health factor is `9.0`.

📱 Open http://localhost:3000 to see the app
