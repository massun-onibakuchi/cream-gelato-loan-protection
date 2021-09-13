import React from 'react'
import { Box, Divider, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react'
import { utils } from 'ethers'
import { ProtectioinTable as ProtectionTable } from '../components/AssetsTable'
import { Layout } from '../components/layout/Layout'
import { useAccountData } from '../hooks/useAccountData'
import { useProtectionFullData } from '../hooks/useProtectionData'

function HomeIndex(): JSX.Element {
  const protectionList = useProtectionFullData()
  const accountData = useAccountData()

  return (
    <Layout>
      <Box maxWidth="container.md" p="8" mt="6" bg="gray.100" alignSelf="center">
        <Box>
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
          </Box>
        </Box>
        <Divider my="4" borderColor="gray.400" />
        <Box>
          <Box>
            <Text fontSize="lg">Protections</Text>
            <Box>
              <ProtectionTable protectionList={protectionList} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default HomeIndex
