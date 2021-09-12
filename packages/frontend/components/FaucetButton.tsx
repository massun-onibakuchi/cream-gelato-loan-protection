import { Button, Text } from '@chakra-ui/react'
import { ChainId, useEthers, useSendTransaction } from "@usedapp/core"
import { utils } from "ethers"

export function FaucetButton() {
    const { account, chainId, library } = useEthers()
    const isLocalChain = chainId === ChainId.Localhost || chainId === ChainId.Hardhat
    const signer = library?.getSigner()

    const { sendTransaction } = useSendTransaction({ signer })

    function sendFunds() {
        sendTransaction({
            to: account,
            value: utils.parseEther('0.1'),
        })
    }
    return (
        <>
            <Text mb="4">This button only works on a Local Chain.</Text>
            <Button colorScheme="teal" onClick={sendFunds} isDisabled={!isLocalChain}>
                Send Funds From Local Chain
            </Button>
        </>)
}