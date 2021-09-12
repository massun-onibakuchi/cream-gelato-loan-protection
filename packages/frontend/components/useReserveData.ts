import { BigNumber, Contract, utils } from 'ethers'
import React, { useEffect, useReducer, useState } from 'react'
import { useContractCall, ChainId } from '@usedapp/core'
import {
  CreamLoanSaverServiceTest as LOAN_SAVER_ADDRESS,
  ComptrollerMock as COMPTROLLER_ADDRESS,
} from '../artifacts/contracts/contractAddress'
import CreamLoanSaverServiceTest from '../artifacts/contracts/CreamLoanSaverService.sol/CreamLoanSaverService.json'
import ComptrollerMock from '../artifacts/contracts/mock/ComptrollerMock.sol/ComptrollerMock.json'
import { CreamLoanSaverServiceTest as LoanSaverType } from '../types/typechain'
import { constants, CREAM_GELATO } from '../constants'

type Resolve<T extends Promise<any>> = T extends PromiseLike<infer P> ? P : never
type TokenMetaDataType = typeof constants[keyof typeof constants][0]

export type ReserveData = {
  balanceUnderlying: BigNumber
  debtUnderlying: BigNumber
  exchangeRateStored: BigNumber
  supplyRatePerBlock: BigNumber
  borrowRatePerBlock: BigNumber
} & TokenMetaDataType

export function useReserveData(chainId: ChainId, account: string, provider): ReserveData[] {
  const [assets, setAssets] = useState([])

  useEffect(() => {
    updateAssets()

    async function updateAssets() {
      if (!chainId) return
      try {
        const loanSaver = new Contract(
          CREAM_GELATO[chainId]['CreamLoanSaverService'],
          CreamLoanSaverServiceTest.abi,
          provider,
        ) as LoanSaverType
        const _assets = (await Promise.all(
          constants[chainId].map((v) => loanSaver.getUserReserveData(v.address, account)),
        )) as Partial<ReserveData>[]
        setAssets(
          constants[chainId].map((v: any, i: number) => {
            return {
              balanceUnderlying: _assets[i].balanceUnderlying,
              debtUnderlying: _assets[i].debtUnderlying,
              exchangeRateStored: _assets[i].exchangeRateStored,
              supplyRatePerBlock: _assets[i].supplyRatePerBlock,
              borrowRatePerBlock: _assets[i].borrowRatePerBlock,
              ...v,
            }
          }),
        )
      } catch (e) {
        console.log('e :>> ', e)
      }
    }
  }, [chainId, account])
  return assets
}
