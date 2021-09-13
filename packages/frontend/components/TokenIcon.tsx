import React from 'react'
import { Icon, Image } from '@chakra-ui/react'

export function TokenIcon(src, alt) {
  return (
    <>
      <Image src={src} alt={alt} fallback={<Icon />} />
    </>
  )
}
