import type { BigNumber } from "ethers"

export type TokenMetaDataType = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  underlyingAddress: string;
  logoURI: string;
}

export type ReserveData = {
  balanceUnderlying: BigNumber
  debtUnderlying: BigNumber
  exchangeRateStored: BigNumber
  supplyRatePerBlock: BigNumber
  borrowRatePerBlock: BigNumber
} & TokenMetaDataType