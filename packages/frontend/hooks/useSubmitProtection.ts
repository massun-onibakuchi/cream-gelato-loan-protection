import { BigNumber } from '@ethersproject/bignumber'
import { useContractFunction, useEthers } from '@usedapp/core'
import { useLoanSaverResolverContract, useLoanSaverServiceContract } from './useContract'

export function useSubmitProtection() {
  const { account, chainId } = useEthers()
  const loanSaver = useLoanSaverServiceContract()
  const resolverContract = useLoanSaverResolverContract()

  // @ts-ignore
  const { state, send, events } = useContractFunction(loanSaver, 'submitProtection', { transactionName: 'Submit' })

  if (!loanSaver || !account || !resolverContract || !chainId) {
    return { state: null, submitProtection: null, events: null }
  }
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
      const resolverData = resolverContract.interface.encodeFunctionData('checker', [
        account,
        resolverCheckerIndex ||
          (await loanSaver
            .getUserProtectionCount(account)
            .then((count) => BigNumber.from(count).add(1))
            .catch((e) => {
              console.debug('can not get user protection count', e)
              return 0
            })),
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
