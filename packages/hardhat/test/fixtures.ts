import hre, { ethers, deployments } from "hardhat"
import { Fixture } from "ethereum-waffle"
import {
    ERC20Mock,
    WETH,
    CTokenMock,
    ComptrollerMock,
    PriceOracleMock,
    PokeMe,
    LoanSaverResolver,
    CreamLoanSaverServiceTest,
    UniswapV2Router02Mock,
    UniswapV2PairMock,
    CusdCoin,
} from "../typechain"
import { Contract } from "ethers"

export const creamFixture2 = deployments.createFixture(async ({ deployments, getNamedAccounts, ethers }, options) => {
    await deployments.fixture(["Cream"])
    const results = await Promise.all(
        [
            "USDCoin",
            "ERC20Mock",
            "CusdCoin",
            "CTokenMock",
            "ComptrollerMock",
            "PriceOracleMock",
            "UniswapV2Router02Mock",
            "UniswapV2PairMock",
        ].map(async name => await deployments.get(name)),
    )
    const [token0, token1, cToken0, cToken1, comptroller, oracle, router, pair] = results.map(
        result => new Contract(result.address, result.abi),
    ) as [
        ERC20Mock,
        ERC20Mock,
        CTokenMock,
        CTokenMock,
        ComptrollerMock,
        PriceOracleMock,
        UniswapV2Router02Mock,
        UniswapV2PairMock,
    ]
    return {
        token0,
        token1,
        cToken0,
        cToken1,
        comptroller,
        oracle,
        router,
        pair,
    }
})

export const gelatoDeployment = async (gelato, treasury, cusdc, comptroller, router, oracle, owner) => {
    const [PokeMe, LoanSaverResolver, CreamLoanSaverServiceTest] = await Promise.all([
        ethers.getContractFactory("PokeMe"),
        ethers.getContractFactory("LoanSaverResolver"),
        ethers.getContractFactory("CreamLoanSaverServiceTest", owner),
    ])
    const pokeMe = (await PokeMe.deploy(gelato.address, treasury.address)) as PokeMe
    const loanSaverService = (await CreamLoanSaverServiceTest.deploy(
        pokeMe.address,
        cusdc.address,
        gelato.address,
        comptroller.address,
        router.address,
        oracle.address,
    )) as CreamLoanSaverServiceTest
    const resolver = (await LoanSaverResolver.deploy(loanSaverService.address)) as LoanSaverResolver
    return { pokeMe, resolver, loanSaverService }
}
