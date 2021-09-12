import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react'
import { ChainId, useContractCall, useEthers, useSendTransaction } from '@usedapp/core'
import { BigNumber, Contract, ethers, providers, utils } from 'ethers'
import React, { useReducer, useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { CreamLoanSaverServiceTest as LoanSaverType } from '../types/typechain'
import { initialOptions, optionReducer } from '../components/optionReducer'
import { useReserveData } from '../components/useReserveData'
import { SelectAsset } from '../components/AssetSelect'
import { AssetsTable } from '../components/AssetsTable'
import { useAccountData } from '../components/useAccountData'

const localProvider = new providers.StaticJsonRpcProvider('http://localhost:8545')
const EXP_SCALE = BigNumber.from(10).pow(18)
const toWei = utils.parseEther

function HomeIndex(): JSX.Element {
  const [protectionAssets, optionDispatch] = useReducer(optionReducer, initialOptions)
  const [targetHealth, setTargetHealth] = useState(1)
  const { account, chainId, library } = useEthers()

  const reserveData = useReserveData(chainId, account, localProvider)
  const accountData = useAccountData(chainId, account, localProvider)
  console.log('accountData :>> ', accountData)
  console.log('utils.formatEther(accountData.healthFactor) :>> ', utils.formatEther(accountData.healthFactor))
  // const accountData = useContractCall({
  //   abi: new utils.Interface(CreamLoanSaverServiceTest.abi),
  //   address: LOAN_SAVER_ADDRESS,
  //   method: 'getUserAccountData',
  //   args: [account],
  // }) ?? []

  ///@todo アセットのリストを保有残高がないなら除き動的に変える（優先度低)
  ///@todo supply debtトークンのname,残高を表示する
  ///@todo getUserAccountData()health factor表示
  ///@todo thresholudHFを設定する
  ///@todo submitProtectionボタン
  const sample = reserveData
  // const sample = [
  //   { name: 'feee', balance: BigNumber.from(11) },
  //   // { tokenName: 'fe9999', balance: reserveData.length ? reserveData[0].balanceUnderlying.toString() : 0 }
  // ]

  const isLocalChain = chainId === ChainId.Localhost || chainId === ChainId.Hardhat

  const signer = localProvider.getSigner()

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
        {/* <Text fontSize="xl">Contract Address: {CONTRACT_ADDRESS}</Text> */}
        <Divider my="8" borderColor="gray.400" />
        <Box>
          <Text fontSize="lg">{'Collateral & Debt'}</Text>
          <AssetsTable data={sample} />
        </Box>
        <Divider my="8" borderColor="gray.400" />
        <Box>
          <SelectAsset
            placeholder="Select col option"
            value={protectionAssets.col}
            onChange={(e) => optionDispatch({ type: 'SET_COL', col: e.target.value })}
            tokenMetaData={[
              {
                address: '0x000',
                name: 'SampleToken',
              },
            ]}
          />
          <SelectAsset
            placeholder="Select bor option"
            value={protectionAssets.bor}
            onChange={(e) => optionDispatch({ type: 'SET_BOR', bor: e.target.value })}
            tokenMetaData={[
              {
                address: '0x000',
                name: 'SampleToken2',
              },
            ]}
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

          <Text fontSize="lg">Minimum Health Factor: {targetHealth}</Text>
          <Slider
            aria-label="slider-ex-5"
            defaultValue={parseFloat(utils.formatEther(accountData.healthFactor))}
            min={0}
            max={10}
            step={0.05}
            onChange={(v) => setTargetHealth(v)}
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
            onChange={(v) => setTargetHealth(v)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Button
            mt="2"
            colorScheme="teal"
            // onClick={ }
          >
            Set Greeting
          </Button>
        </Box>
        <Divider my="8" borderColor="gray.400" />
      </Box>
    </Layout>
  )
}

export default HomeIndex
