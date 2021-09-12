import { useToken } from '@chakra-ui/system'
import { BigNumber } from '@ethersproject/bignumber'
import { useContractFunction, useEthers } from '@usedapp/core'
import { useTokenContract } from './useContract'

export function useTokenApprove(token: string, spender: string, amount: BigNumber) {
  const tokenContract = useTokenContract(token)
  console.log('token :>> ', token)
  // @ts-ignore
  const { state, send, events } = useContractFunction(tokenContract, 'approve', { transactionName: 'Approve' })
  return {
    state,
    approve: async (): Promise<void> => send(spender, amount),
    events,
  }
}
