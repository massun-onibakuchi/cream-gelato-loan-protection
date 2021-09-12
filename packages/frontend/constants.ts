import { ChainId } from '@usedapp/core'
import {
  USDCoin as USDC_ADDRESS,
  ERC20Mock as MOCK_TOKEN_ADDRESS,
  CusdCoin as CUSDC_ADDRESS,
  CTokenMock as CTOKEN_ADDRESS,
  CreamLoanSaverServiceTest as LOAN_SAVER_ADDRESS,
} from './artifacts/contracts/contractAddress'
import CreamLoanSaverServiceTest from './artifacts/contracts/CreamLoanSaverService.sol/CreamLoanSaverService.json'
import { CreamLoanSaverServiceTest as LoanSaverType } from './types/typechain'

export const constants = {
  [ChainId.Localhost]: [
    {
      name: 'USDCoin',
      symbol: 'USDC',
      decimals: 6,
      address: CUSDC_ADDRESS,
      underlyingAddress: USDC_ADDRESS,
    },
    {
      name: 'MockToken',
      symbol: 'MOCK',
      decimals: 18,
      address: CTOKEN_ADDRESS,
      underlyingAddress: MOCK_TOKEN_ADDRESS,
    },
  ],
}
export const CREAM_GELATO = {
  [ChainId.Localhost]: { CreamLoanSaverService: LOAN_SAVER_ADDRESS },
}
