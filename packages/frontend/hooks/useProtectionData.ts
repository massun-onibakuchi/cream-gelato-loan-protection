import { useState, useEffect, useMemo } from 'react'
import { utils } from 'ethers'
import { useContractCall, useEthers } from '@usedapp/core'
import { useLoanSaverServiceContract } from './useContract'
import { useReserveData } from './useReserveData'
import { CREAM_GELATO_CONTRACTS } from '../constants'
import { ProtectionAssetData, ProtectionData } from '../types/ProtectionData'
import CreamLoanSaverService from '../artifacts/contracts/CreamLoanSaverService.sol/CreamLoanSaverService.json'

export function useProtectionData() {
  const { account, chainId } = useEthers()
  const loanSaver = useLoanSaverServiceContract()
  const [protections, setProtections] = useState<ProtectionData[]>([])

  const [numOfProtection] =
    useContractCall({
      abi: new utils.Interface(CreamLoanSaverService.abi),
      address: CREAM_GELATO_CONTRACTS[chainId || 0]['CreamLoanSaverService'],
      method: 'getUserProtectionCount',
      args: [account],
    }) ?? []

  useEffect(() => {
    updateProtectionData()

    async function updateProtectionData() {
      if (!loanSaver || !account || !numOfProtection || numOfProtection.isZero()) return
      try {
        const _data = (await Promise.all(
          Array(parseInt(numOfProtection.toString()))
            .fill(undefined)
            .map((v, i) => loanSaver.getUserProtectionDataByIndex(account, i)),
        )) as Partial<ProtectionData>[]

        setProtections(
          _data.map((v) => {
            return {
              protectionId: v.protectionId,
              thresholdHealthFactor: v.thresholdHealthFactor,
              wantedHealthFactor: v.wantedHealthFactor,
              colToken: v.colToken,
              debtToken: v.debtToken,
            }
          }),
        )
      } catch (e) {
        console.log('e :>> ', e)
      }
    }
  }, [numOfProtection, loanSaver, account])

  return protections
}

export function useProtectionFullData(): ProtectionAssetData[] {
  const protections = useProtectionData()
  const reserveData = useReserveData()

  const fullData = useMemo(() => {
    if (!protections?.length || !reserveData?.length) return
    return protections.map((v) => {
      return {
        ...v,
        col: reserveData.find((d) => d.address == v.colToken),
        debt: reserveData.find((d) => d.address == v.debtToken),
      }
    })
  }, [protections, reserveData])
  return fullData
}
