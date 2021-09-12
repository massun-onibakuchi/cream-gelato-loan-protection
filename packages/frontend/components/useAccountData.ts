import { BigNumber, Contract, utils } from 'ethers'
import React, { useEffect, useState } from 'react'
import { ChainId, useContractCall } from '@usedapp/core'
import { CreamLoanSaverServiceTest as LOAN_SAVER_ADDRESS } from '../artifacts/contracts/contractAddress'
import CreamLoanSaverServiceTest from '../artifacts/contracts/CreamLoanSaverService.sol/CreamLoanSaverService.json'
import { CreamLoanSaverServiceTest as LoanSaverType } from '../types/typechain'
import { CREAM_GELATO } from '../constants'

type Resolve<T extends Promise<any>> = T extends PromiseLike<infer P> ? P : never

// type AccountData= Partial<Resolve<ReturnType<LoanSaverType['getUserAccountData']>>
type AccountData = {
  totalCollateralInEth: BigNumber
  totalBorrowInEth: BigNumber
  healthFactor: BigNumber
  ethPerUsd: BigNumber
}

export function useAccountData(chainId: ChainId, account: string, provider?): AccountData {
  const [accountData, setAccountData] = useState({
    totalCollateralInEth: BigNumber.from(0),
    totalBorrowInEth: BigNumber.from(0),
    healthFactor: BigNumber.from(0),
    ethPerUsd: BigNumber.from(0),
  })

  useEffect(() => {
    fetchData()
    async function fetchData() {
      const loanSaver = new Contract(
        CREAM_GELATO[chainId]['CreamLoanSaverService'],
        CreamLoanSaverServiceTest.abi,
        provider,
      ) as LoanSaverType
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
