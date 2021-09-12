import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const sampleDeployment: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { owner } = await getNamedAccounts()

    const options = { from: owner }
    await deploy("YourContract", { ...options, args: ["Hello, Hardhat!"] })
    await deploy("Multicall", { ...options, args: [] })
}
export default sampleDeployment
sampleDeployment.tags = ["YourContract"]
