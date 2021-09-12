import {
  Box, Button, Divider, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text,
} from '@chakra-ui/react'
import { useEthers, useSendTransaction, } from '@usedapp/core'
import { BigNumber, ethers, providers, utils } from 'ethers'
import React, { useEffect, useReducer, useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { initialOptions, optionReducer } from '../components/optionReducer'
import { SelectCollateral, SelectDebt } from '../components/AssetSelect'
import { AssetsTable } from '../components/AssetsTable'
import { useAccountData } from '../hooks/useAccountData'
import { useReserveData } from '../hooks/useReserveData'
import { useSubmitProtection } from '../hooks/useSubmitProtection'
import { ApprovalState, useApproveCallback } from '../hooks/useApproveCallback'

const toWei = utils.parseEther

function HomeIndex(): JSX.Element {
  const [protectionAssets, optionDispatch] = useReducer(optionReducer, initialOptions)
  const [{ targetHealth, thresholdHealth }, setTargetHealth] = useState({ targetHealth: 1, thresholdHealth: 1 })
  const { account, chainId, library } = useEthers()
  const [isLoading, setLoanding] = useState(false)

  const reserveData = useReserveData()
  const accountData = useAccountData()

  const { state: submissionState, submitProtection, events: submissionEvents } = useSubmitProtection()
  const [approvalState, approve] = useApproveCallback(
    { isNative: false, tokenAddr: protectionAssets?.col, amount: ethers.constants.MaxUint256 },
    account,
  )

  // console.log('reserveData :>> ', reserveData)
  console.log('approveState :>> ', approvalState)

  async function sendApproveTx() {
    // for debug
    // if (accountData?.healthFactor.gt(targetHealth) || targetHealth < thresholdHealth || thresholdHealth < 1) return
    if (!library || !account /*|| resolverContract */ || isLoading) return
    setLoanding(true)
    // await approve()
    await approve()
    updateTransationStatus()
  }

  async function sendSubmitProtectionTx() {
    if (targetHealth < thresholdHealth || thresholdHealth < 1) return
    if (!account) return
    setLoanding(true)
    await submitProtection({
      thresholdHealth: toWei(thresholdHealth.toString()),
      targetHealth: toWei(targetHealth.toString()),
      col: protectionAssets.col,
      bor: protectionAssets.bor,
      useTaskTreasuryFunds: false,
    })
    updateTransationStatus()

  }
  async function updateTransationStatus() {
    if (!approvalState || !submissionState) return
    if (submissionState.status === 'Mining') {
      setLoanding(true)
      return
    }
    if (approvalState === ApprovalState.PENDING) {
      setLoanding(true)
      return
    }
    setLoanding(false)
  }

  useEffect(() => {
    updateTransationStatus()
  }, [approvalState])

  ///@todo アセットのリストを保有残高がないなら除き動的に変える（優先度低)
  ///@todo allowanceとapproveのチェック
  ///@todo submitProtection hooks

  // const isLocalChain = chainId === ChainId.Localhost || chainId === ChainId.Hardhat
  const signer = library?.getSigner()

  // Use the localProvider as the signer to send ETH to our wallet
  const { sendTransaction } = useSendTransaction({ signer })

  function sendFunds(): void {
    sendTransaction({
      to: account,
      value: utils.parseEther('0.1'),
    })
  }
  return (
    <Layout>
      <Heading as="h1" mb="8">
        Next.js Ethereum Starter
      </Heading>
      <Text mt="8" fontSize="xl">
        This page only works on the ROPSTEN Testnet or on a Local Chain.
      </Text>
      <Box maxWidth="container.sm" p="8" mt="8" bg="gray.100">
        <Divider my="8" borderColor="gray.400" />
        <Box>
          <Text fontSize="lg">{'Collateral & Debt'}</Text>
          <AssetsTable data={reserveData} />
        </Box>
        <Divider my="8" borderColor="gray.400" />
        <Box>
          <SelectCollateral
            col={protectionAssets.col}
            onChange={(e) => optionDispatch({ type: 'SET_COL', col: e.target.value })}
            tokenMetaData={reserveData}
          />
          <SelectDebt
            bor={protectionAssets.bor}
            onChange={(e) => optionDispatch({ type: 'SET_BOR', bor: e.target.value })}
            tokenMetaData={reserveData}
          />
        </Box>
        <Divider my="8" borderColor="gray.400" />
        <Box>
          <Text fontSize="lg">Health Factor:{utils.formatEther(accountData.healthFactor)}</Text>
          <Slider
            aria-label="slider-ex-5"
            value={parseFloat(utils.formatEther(accountData.healthFactor))}
            min={0}
            max={10}
            isDisabled
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>

          <Text fontSize="lg">Minimum Health Factor: {thresholdHealth}</Text>
          <Slider
            aria-label="slider-ex-5"
            defaultValue={parseFloat(utils.formatEther(accountData.healthFactor))}
            min={0}
            max={10}
            step={0.05}
            onChange={(v) => setTargetHealth((state) => ({ ...state, thresholdHealth: v }))}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>

          <Text fontSize="lg">Target Health Factor: {targetHealth}</Text>
          <Slider
            aria-label="slider-ex-5"
            defaultValue={parseFloat(utils.formatEther(accountData.healthFactor))}
            min={0}
            max={10}
            step={0.05}
            onChange={(v) => setTargetHealth((state) => ({ ...state, targetHealth: v }))}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Button mt="2" colorScheme="teal" onClick={sendApproveTx} isLoading={isLoading}>
            Set Greeting
          </Button>
        </Box>
        <Divider my="8" borderColor="gray.400" />
      </Box>
    </Layout>
  )
}

export default HomeIndex
