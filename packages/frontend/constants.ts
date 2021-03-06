import { ChainId } from '@usedapp/core'
import {
  USDCoin as USDC_ADDRESS,
  ERC20Mock as MOCK_TOKEN_ADDRESS,
  CusdCoin as CUSDC_ADDRESS,
  CTokenMock as CTOKEN_ADDRESS,
  CreamLoanSaverServiceTest as LOAN_SAVER_ADDRESS,
  LoanSaverResolver as RESOLVER_ADDRESS,
} from './artifacts/contracts/contractAddress'

export const TOKEN_METADATA = {
  [ChainId.Localhost]: [
    {
      name: 'USDCoin',
      symbol: 'USDC',
      decimals: 6,
      address: CUSDC_ADDRESS,
      underlyingAddress: USDC_ADDRESS,
      logoURI: 'https://tokens.1inch.exchange/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
    },
    {
      name: 'MockToken',
      symbol: 'MOCK',
      decimals: 18,
      address: CTOKEN_ADDRESS,
      underlyingAddress: MOCK_TOKEN_ADDRESS,
      logoURI: 'https://tokens.1inch.exchange/0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e.png',
    },
  ],
}
export const CREAM_GELATO_CONTRACTS = {
  [0]: {
    CreamLoanSaverService: LOAN_SAVER_ADDRESS,
    LoanSaverResolver: RESOLVER_ADDRESS,
  },
  [ChainId.Localhost]: {
    CreamLoanSaverService: LOAN_SAVER_ADDRESS,
    LoanSaverResolver: RESOLVER_ADDRESS,
  },
}
