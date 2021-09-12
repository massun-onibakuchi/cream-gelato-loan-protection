import { BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { constants } from '../constants'
import { useLoanSaverServiceContract } from './hooks/useContract'

type Resolve<T extends Promise<any>> = T extends PromiseLike<infer P> ? P : never
type TokenMetaDataType = typeof constants[keyof typeof constants][0]

export type ReserveData = {
  balanceUnderlying: BigNumber
  debtUnderlying: BigNumber
  exchangeRateStored: BigNumber
  supplyRatePerBlock: BigNumber
  borrowRatePerBlock: BigNumber
} & TokenMetaDataType

export function useReserveData(): ReserveData[] {
  const [assets, setAssets] = useState([])
  const { account, chainId } = useEthers()
  const loanSaver = useLoanSaverServiceContract()

  useEffect(() => {
    updateAssets()

    async function updateAssets() {
      if (!chainId || !loanSaver || !account) return
      try {
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
