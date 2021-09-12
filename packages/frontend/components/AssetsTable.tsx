import React from 'react'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption } from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import type { ReserveData } from '../hooks/useReserveData'

type RowItemType = {
  name: string
  symbol: string
  decimals: number | BigNumber
  balanceUnderlying: BigNumber
  debtUnderlying: BigNumber
}

type AssetsTableType = {
  data: RowItemType[]
}

function TableRowItem(props: RowItemType) {
  return props ? (
    <Tr>
      <Td>icon</Td>
      <Td>{props.symbol}</Td>
      <Td isNumeric>{utils.formatUnits(props.balanceUnderlying, props.decimals)}</Td>
      <Td isNumeric>{utils.formatUnits(props.debtUnderlying, props.decimals)}</Td>
    </Tr>
  ) : null
}

export function AssetsTable(props: AssetsTableType) {
  const data = props.data
  const listItems = data.map((d) => <TableRowItem key={d.name} {...d} />)
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
