import { Box, Grid, Icon, Image, List, Container, ListItem, Text } from '@chakra-ui/react'
import { utils } from 'ethers'
import React from 'react'

export function TokenIcon(src, alt) {
  return (
    <>
        <Image p="0" src={src} alt={alt} fallback={<Icon />} />
    </>
  )
}

// function ProtectionList() {
//   // const reserveData = useReserveData()
//   const protectionList = useProtectionFullData()
//   console.log('protectionList : >> ', protectionList)
//   // const protections = useProtectionData()
//   // console.log('protections :>> ', protections);
//   return (
//     <List>
//       {protectionList &&
//         protectionList.map((data) => (
//           <Grid>
//             <ListItem
//               flexDirection="row"
//               display="grid"
//               autoRows="auto"
//               templateRows="auto"
//               templateColumns="auto"
//               columnGap="20px"
//               rowGap="8px"
//               align-items="center"
//               height="84px"
//               padding="12px 0"
//             >
//               <Text fontSize="text-base">{data.protectionId}</Text>
//               <Container>
//                 <TokenIcon src={data.col.logoURI} alt={`${data.col.symbol} logo`} />
//               </Container>
//               <Text fontSize="text-base">{data.col.symbol}</Text>
//               {data.col?.balanceUnderlying && (
//                 <Text fontSize="text-base">{utils.formatUnits(data.col.balanceUnderlying, data.col.decimals)}</Text>
//               )}
//               <Container>
//                 <TokenIcon src={data.debt.logoURI} alt={`${data.debt.symbol} logo`} />
//               </Container>
//               <Text fontSize="text-base">{data.debt.symbol}</Text>
//               {data.debt?.debtUnderlying && (
//                 <Text fontSize="text-base">{utils.formatUnits(data.debt.debtUnderlying, data.col.decimals)}</Text>
//               )}
//             </ListItem>
//           </Grid>
//         ))}
//     </List>
//   )
// }
