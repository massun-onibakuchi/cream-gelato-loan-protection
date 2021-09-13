import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Icon, Image, Box, Wrap } from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import { TokenIcon } from './TokenIcon'
import { ProtectionAssetData, useProtectionFullData } from '../hooks/useProtectionData'
import { ReserveData } from '../hooks/useReserveData'

type RowItemType = {
  name: string
  symbol: string
  decimals: number | BigNumber
  balanceUnderlying: BigNumber
  debtUnderlying: BigNumber
  logoURI: string
}

function AssetItem(props: RowItemType) {
  return props ? (
    <Tr>
      <Td>
        <TokenIcon src={props.logoURI} alt={`${props.symbol} log`} />
      </Td>
      <Td>{props.symbol}</Td>
      <Td isNumeric>{utils.formatUnits(props.balanceUnderlying, props.decimals)}</Td>
      <Td isNumeric>{utils.formatUnits(props.debtUnderlying, props.decimals)}</Td>
    </Tr>
  ) : null
}

export function AssetTable({ data }: { data: ReserveData[] }) {
  const listItems = data.map((d) => <AssetItem key={d.name} {...d} />)
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Icon</Th>
          <Th>Name</Th>
          <Th>Collateral</Th>
          <Th>Debt</Th>
        </Tr>
      </Thead>
      <Tbody>{listItems}</Tbody>
    </Table>
  )
}

function ProtectioinItem({ data }: { data: ProtectionAssetData }) {
  return (
    <Tr justifyContent="center" alignItems="center">
      <Td>{data.protectionId.slice(0, 7).concat('...')}</Td>
      <Td>
        <Wrap align="center">
          <Box>
            <TokenIcon src={data.col.logoURI} alt={`${data.col.symbol} logo`} />
          </Box>
          {/* <Box fontWeight="semibold" fontSize="sm">{data.col.symbol}</Box> */}
        </Wrap>
      </Td>
      <Td isNumeric>
        {data.col?.balanceUnderlying && utils.formatUnits(data.col.balanceUnderlying, data.col.decimals)}
      </Td>
      <Td>
        <Wrap align="center">
          <Box>
            <TokenIcon src={data.debt.logoURI} alt={`${data.debt.symbol} logo`} />
          </Box>
          {/* <Box fontWeight="semibold" fontSize="sm">{data.debt.symbol}</Box> */}
        </Wrap>
      </Td>
      <Td isNumeric>{utils.formatUnits(data.debt.debtUnderlying, data.debt.decimals)}</Td>
    </Tr>
  )
}

export function ProtectioinTable({ protectionList }: { protectionList: ProtectionAssetData[] }) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>protectionId</Th>
          <Th>token</Th>
          <Th>collateral</Th>
          <Th>token</Th>
          <Th>debt</Th>
        </Tr>
      </Thead>
      <Tbody>{protectionList && protectionList.map((data) => <ProtectioinItem data={data} />)}</Tbody>
    </Table>
  )
}
