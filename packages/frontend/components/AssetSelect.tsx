import React from 'react'
import { Select } from '@chakra-ui/react'

function SelectItem(props) {
  return <option value={props.address}>{props.name}</option>
}

export function SelectAsset(props) {
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
