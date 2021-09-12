import { Contract, ethers, utils } from 'ethers'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { useMemo } from 'react'
import { ERC20, useEthers } from '@usedapp/core'
import CreamLoanSaverServiceTest from '../artifacts/contracts/CreamLoanSaverService.sol/CreamLoanSaverService.json'
import LoanSaverResolver from '../artifacts/contracts/LoanSaverResolver.sol/LoanSaverResolver.json'
import { CREAM_GELATO_CONTRACTS } from '../constants'

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { library, account, chainId, active, error } = useEthers()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId || !active) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}

// account is optional
function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!utils.isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// account is not optional
function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

export function useLoanSaverServiceContract(): Contract {
  return useContract(CREAM_GELATO_CONTRACTS[0]['CreamLoanSaverService'], CreamLoanSaverServiceTest.abi, true)
}
export function useLoanSaverResolverContract(): Contract {
  return useContract(CREAM_GELATO_CONTRACTS[0]['LoanSaverResolver'], LoanSaverResolver.abi, true)
}
export function useTokenContract(tokenAddress): Contract {
  return useContract(tokenAddress, ERC20.abi, true)
}
