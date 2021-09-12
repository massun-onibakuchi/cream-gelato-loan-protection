import { BigNumber } from '@ethersproject/bignumber'
import { useContractFunction, useEthers } from '@usedapp/core'
import { useLoanSaverResolverContract, useLoanSaverServiceContract } from './useContract'

export function useSubmitProtection() {
  const { account } = useEthers()
  const loanSaver = useLoanSaverServiceContract()
  const resolverContract = useLoanSaverResolverContract()

  if (!loanSaver || !account || !resolverContract) return
  // @ts-ignore
  const { state, send, events } = useContractFunction(loanSaver, 'submitProtection', { transactionName: 'Submit' })

  return {
    state,
    submitProtection: async ({
      thresholdHealth,
      targetHealth,
      col,
      bor,
      useTaskTreasuryFunds,
      resolverCheckerIndex,
    }: {
      thresholdHealth: BigNumber
      targetHealth: BigNumber
      col: string
      bor: string
      useTaskTreasuryFunds?: boolean
      resolverCheckerIndex?: number | BigNumber | undefined
    }): Promise<void> => {
      const resolverData = resolverContract.interface.encodeFunctionData('checker',
        [
          account,
          resolverCheckerIndex || await resolverContract.getUserProtectionCount(account)
            .then(count => count.add(1)).catch(e => {
              console.debug("can not get user protection count", e)
              return 0
            })
        ])
      return send(
        thresholdHealth,
        targetHealth,
        col,
        bor,
        resolverContract.address,
        resolverData,
        useTaskTreasuryFunds || false,
      )
    },
    events,
  }
}
