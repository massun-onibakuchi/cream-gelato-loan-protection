import { task } from 'hardhat/config';
import { HardhatUserConfig } from 'hardhat/types';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import "hardhat-deploy"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: '../frontend/types/typechain',
    // outDir: './typechain',
  },
  paths: {
    sources: "./contracts",
    artifacts: '../frontend/artifacts',
    // artifacts: './artifacts',
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  namedAccounts: {
    wallet: {
      default: 0,
    },
    deployer: {
      default: 1,
    },
    owner: {
      default: 1,
    },
    receiver: {
      default: 2,
    },
    gelato: {
      default: 5,
    }
  },

};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

export default config;

