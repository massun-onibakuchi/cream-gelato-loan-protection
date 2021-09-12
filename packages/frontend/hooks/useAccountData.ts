import { BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'
import { ChainId, useEthers } from '@usedapp/core'
import { useLoanSaverServiceContract } from './useContract'

// type Resolve<T extends Promise<any>> = T extends PromiseLike<infer P> ? P : never
// type AccountData= Partial<Resolve<ReturnType<LoanSaverType['getUserAccountData']>>

type AccountData = {
  totalCollateralInEth: BigNumber
  totalBorrowInEth: BigNumber
  healthFactor: BigNumber
  ethPerUsd: BigNumber
}

export function useAccountData(): AccountData {
  const loanSaver = useLoanSaverServiceContract()
  const { account } = useEthers()
  const [accountData, setAccountData] = useState({
    totalCollateralInEth: BigNumber.from(0),
    totalBorrowInEth: BigNumber.from(0),
    healthFactor: BigNumber.from(0),
    ethPerUsd: BigNumber.from(0),
  })

  useEffect(() => {
    if (!loanSaver || !account) return
    fetchData()
    async function fetchData() {
      const data = await loanSaver.getUserAccountData(account)
      setAccountData({
        totalCollateralInEth: data.totalCollateralInEth,
        totalBorrowInEth: data.totalBorrowInEth,
        healthFactor: data.healthFactor,
        ethPerUsd: data.ethPerUsd,
      })
    }
  }, [account])
  return accountData
}
