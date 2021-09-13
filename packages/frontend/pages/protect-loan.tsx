import React, { useEffect, useReducer, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { ethers, utils } from 'ethers'
import { useEthers } from '@usedapp/core'
import { Layout } from '../components/layout/Layout'
import { initialOptions, optionReducer } from '../components/optionReducer'
import { SelectCollateral, SelectDebt } from '../components/AssetSelect'
import { AssetTable } from '../components/AssetsTable'
import { useAccountData } from '../hooks/useAccountData'
import { useReserveData } from '../hooks/useReserveData'
import { useSubmitProtection } from '../hooks/useSubmitProtection'
import { ApprovalState, useApproveCallback } from '../hooks/useApproveCallback'

const toWei = utils.parseEther

function HomeIndex(): JSX.Element {
  const { account, chainId, library } = useEthers()
  const [protectionAssets, optionDispatch] = useReducer(optionReducer, initialOptions)
  const [{ targetHealth, thresholdHealth }, setTargetHealth] = useState({ targetHealth: 1, thresholdHealth: 1 })
  const reserveData = useReserveData()
  const accountData = useAccountData()

  const [isLoading, setLoanding] = useState(false)

  const { state: submissionState, submitProtection, events: submissionEvents } = useSubmitProtection()
  const [approvalState, approve, approvalTxnState] = useApproveCallback(
    { isNative: false, tokenAddr: protectionAssets?.col, amount: ethers.constants.MaxUint256 },
    account,
  )
  const toast = useToast()

  async function sendApproveTxn() {
    if (!library || !account || isLoading || !approvalState || !approve) return
    setLoanding(true)
    await approve()
    updateTransationStatus()
  }

  async function sendSubmitProtectionTxn() {
    console.log('submissionState :>> ', submissionState)
    if (!library || !account || isLoading || !submissionState || !submitProtection) return
    if (!(targetHealth > thresholdHealth) || !(thresholdHealth > 1)) {
      toast({
        title:
          thresholdHealth <= 1
            ? `Threshold health factor must be greater than 1`
            : `Target health factor must be greater than threshold one`,
        status: 'error',
        isClosable: true,
        position: 'top',
      })
      return
    }
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
    if (submissionState.status === 'Exception') {
      toast({
        title: submissionState.errorMessage,
        status: 'error',
        isClosable: true,
        position: 'top',
      })
      setLoanding(false)
      return
    }
    if (approvalTxnState.status === 'Exception') {
      toast({
        title: approvalTxnState.errorMessage,
        status: 'error',
        isClosable: true,
        position: 'top',
      })
      setLoanding(false)
      return
    }
    if (submissionState.status === 'Mining') {
      toast({
        title: 'Waiting the transaction is mined...',
        status: 'info',
        isClosable: true,
        position: 'top',
      })
      setLoanding(true)
      return
    }
    if (approvalState === ApprovalState.PENDING) {
      toast({
        title: 'Waiting the transaction is mined...',
        status: 'info',
        isClosable: true,
        position: 'top',
      })
      setLoanding(true)
      return
    }
    if (approvalState === ApprovalState.APPROVED) {
      setLoanding(false)
      return
    }
    setLoanding(false)
  }

  useEffect(() => {
    updateTransationStatus()
  }, [approvalState, submissionState])

  return (
    <Layout>
      <Box maxWidth="container.md" p="8" mt="6" bg="gray.100">
        <Box>
          <Text fontSize="lg">{'Collateral & Debt'}</Text>
          <AssetTable data={reserveData} />
        </Box>
        <Divider my="4" borderColor="gray.400" />
        <Box>
          <Text fontSize="lg">Select collateral asset for loan protection</Text>
          <SelectCollateral
            col={protectionAssets.col}
            onChange={(e) => optionDispatch({ type: 'SET_COL', col: e.target.value })}
            tokenMetaData={reserveData}
          />
        </Box>
        <Divider my="4" borderColor="gray.400" />
        <Box>
          <Text fontSize="lg">Select debt asset for loan protection</Text>
          <SelectDebt
            bor={protectionAssets.bor}
            onChange={(e) => optionDispatch({ type: 'SET_BOR', bor: e.target.value })}
            tokenMetaData={reserveData}
          />
        </Box>
        <Divider my="4" borderColor="gray.400" />
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
            defaultValue={1}
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
            defaultValue={1}
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
          <Button
            mt="2"
            colorScheme="teal"
            onClick={approvalState === ApprovalState.APPROVED ? sendSubmitProtectionTxn : sendApproveTxn}
            isLoading={isLoading}
            isDisabled={!protectionAssets.col || !protectionAssets.bor}
          >
            {approvalState === ApprovalState.APPROVED ? 'Submit protection' : 'Approve'}
          </Button>
        </Box>
        <Divider my="4" borderColor="gray.400" />
      </Box>
    </Layout>
  )
}

export default HomeIndex
