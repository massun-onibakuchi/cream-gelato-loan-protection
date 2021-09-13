import { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { useLoanSaverServiceContract } from './useContract'
import { TOKEN_METADATA } from '../constants'
import { ReserveData } from '../types/ReserveData'

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
          TOKEN_METADATA[chainId].map((v) => loanSaver.getUserReserveData(v.address, account)),
        )) as Partial<ReserveData>[]
        setAssets(
          TOKEN_METADATA[chainId].map((v: any, i: number) => {
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
