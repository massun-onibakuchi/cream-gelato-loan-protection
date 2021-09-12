import React from 'react'
import { Select } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { ReserveData } from '../hooks/useReserveData'

function SelectItem(props) {
  return <option value={props.value}>{props.name}</option>
}

function SelectAsset(props: { tokenMetaData: ReserveData[]; placeholder: string; value: any; onChange: any }) {
  const tokens = props.tokenMetaData
  const selectOptions = tokens.map((metadata) => (
    <SelectItem key={metadata.address} value={metadata.address} name={metadata.name} />
  ))
  return (
    <Select placeholder={props.placeholder} value={props.value} onChange={props.onChange}>
      {selectOptions}
    </Select>
  )
}

export function SelectCollateral({
  col,
  onChange,
  tokenMetaData,
}: {
  col: string
  onChange: (v) => void
  tokenMetaData: ReserveData[]
}) {
  const data = tokenMetaData.filter((v) => v.balanceUnderlying.gt(0))
  return <SelectAsset placeholder="Select collateral" value={col} onChange={onChange} tokenMetaData={data} />
}
export function SelectDebt({
  bor,
  onChange,
  tokenMetaData,
}: {
  bor: string
  onChange: (v) => void
  tokenMetaData: ReserveData[]
}) {
  const data = tokenMetaData.filter((v) => v.debtUnderlying.gt(0))
  return <SelectAsset placeholder="Select Debt" value={bor} onChange={onChange} tokenMetaData={data} />
}
