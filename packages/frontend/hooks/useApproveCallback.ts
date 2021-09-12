import { BigNumber, ethers } from 'ethers'
import { useCallback, useMemo } from 'react'
import { useEthers, useTokenAllowance, useTransactions, useContractFunction, TransactionStatus } from '@usedapp/core'
import { useTokenContract } from './useContract'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}


// returns a variable indicating the state of t he approval and a function which approves if necessary or early returns
export function useApproveCallback(
  approvalData?: { tokenAddr: string; isNative?: boolean; amount: BigNumber },
  spender?: string,
): [ApprovalState, () => Promise<void>, TransactionStatus?, ethers.utils.LogDescription[]?] {
  const { account, chainId } = useEthers()
  const tokenAddr = approvalData?.tokenAddr || undefined
  const currentAllowance = useTokenAllowance(tokenAddr, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(tokenAddr, spender)
  const tokenContract = useTokenContract(tokenAddr)
  console.debug('amountToApprove :>> ', approvalData)

  // @ts-ignore
  const { state, send, events } = useContractFunction(tokenContract, 'approve', { transactionName: 'Approve' })

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!approvalData || !spender) return ApprovalState.UNKNOWN
    if (approvalData?.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lt(approvalData.amount)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [approvalData, currentAllowance, pendingApproval, spender])

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!chainId) {
      console.error('no chainId')
      return
    }

    if (!tokenAddr) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!approvalData) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    const estimatedGas = await tokenContract.estimateGas.approve(spender, ethers.constants.MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      return tokenContract.estimateGas.approve(spender, approvalData.amount)
    })

    return send(spender, approvalData.amount /* estimateGas */).catch((error: Error) => {
      console.debug('Failed to approve token', error)
      throw error
    })
  }, [approvalState, tokenAddr, tokenContract, approvalData, spender, chainId])

  return [approvalState, approve, state, events]
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(tokenAddress: string | undefined, spender: string | undefined): boolean {
  return false
  // const allTransactions = useAllTransactions()
  // return useMemo(
  //     () =>
  //         typeof tokenAddress === 'string' &&
  //         typeof spender === 'string' &&
  //         Object.keys(allTransactions).some((hash) => {
  //             const tx = allTransactions[hash]
  //             if (!tx) return false
  //             if (tx.receipt) {
  //                 return false
  //             } else {
  //                 const approval = tx.approval
  //                 if (!approval) return false
  //                 return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx)
  //             }
  //         }),
  //     [allTransactions, spender, tokenAddress]
  // )
}

function useAllTransactions() {
  const { transactions } = useTransactions()
}
