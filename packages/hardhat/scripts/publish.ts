import hre, { config } from 'hardhat';
import fs from 'fs';

async function main() {
  const path = `${config.paths.artifacts}/contracts/contractAddress.ts`
  if (fs.existsSync(path)) fs.unlinkSync(path)

  const allDeployments = await hre.deployments.all()

  for (const [name, deployment] of Object.entries(allDeployments)) {
    saveFrontendFiles(deployment.address, name);
    console.log(`${name} deployed to: ${deployment.address}`);
  }
}

function saveFrontendFiles(address: string, contractName: string) {
  fs.appendFileSync(
    `${config.paths.artifacts}/contracts/contractAddress.ts`,
    `export const ${contractName} = '${address}'\n`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
