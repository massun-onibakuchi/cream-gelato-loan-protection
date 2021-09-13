import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { useLoanSaverServiceContract } from './useContract'

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
