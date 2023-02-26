import Head from "next/head"
import {
    Input,
    Heading,
    Center,
    VStack,
    InputGroup,
    InputRightAddon,
    Button,
    Text,
} from "@chakra-ui/react"
import { ChangeEvent, useReducer, useState } from "react"
import QRCode from "react-qr-code"

export default function Home() {
    const checkUsernameEndpoint = "/api/checkusername"
    const registerUserEndpoint = "/api/registeruser"
    const buttontexts = ["Check Username", "Register Username"]

    const [usernameChecked, setUsernameChecked] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [buttonText, setButtonText] = useState(buttontexts[0])
    const [username, setUsername] = useState("")
    const [npub, setNpub] = useState("")
    type checkResponse = {
        exists: false
        error: false
        message: ""
        invoice_id: false
        payment_request: ""
    }

    const [responseExists, setResponseExists] = useState<boolean>(false)
    const [responseError, setResponseError] = useState<boolean>(false)
    const [responseMessage, setResponseMessage] = useState<string>("")
    const [responseInvoiceId, setResponseInvoiceId] = useState<false | number>(
        false
    )
    const [responsePaymentRequest, setResponsePaymentRequest] =
        useState<string>("")

    function handleChangeInput(e: ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value)
    }

    function handleChangeNpub(e: ChangeEvent<HTMLInputElement>) {
        setNpub(e.target.value)
    }

    async function handleCheckUsername() {
        setButtonLoading(true)

        const response = await fetch(checkUsernameEndpoint, {
            method: "POST",
            headers: {
                contentType: "application/json",
            },
            body: JSON.stringify({ user: username }),
        })
        const parsedResponse = (await response.json()) as checkResponse
        setResponseExists(parsedResponse.exists)
        setResponseError(parsedResponse.error)
        setResponseMessage(parsedResponse.message)
        setResponsePaymentRequest(parsedResponse.payment_request)
        setResponseInvoiceId(parsedResponse.invoice_id)

        setButtonLoading(false)

        if (parsedResponse.exists) {
            alert(parsedResponse.message)
        } else {
            setUsernameChecked(true)
            setButtonText(buttontexts[1])
        }
    }

    async function registerUsernameAndNpub(userNpub: string) {
        setButtonLoading(true)
        const response = await fetch(registerUserEndpoint, {
            method: "POST",
            headers: {
                contentType: "application/json",
            },
            body: JSON.stringify({
                user: username,
                npub: userNpub,
                invoice_id: responseInvoiceId,
            }),
        })

        const parsedResponse = await response.json()

        if (parsedResponse.reset_invoice) {
            setUsernameChecked(false)
            setButtonLoading(false)
            setButtonText(buttontexts[0])
            setUsername("")
            setNpub("")

            setResponseExists(false)
            setResponseError(false)
            setResponseMessage("")
            setResponsePaymentRequest("")
            setResponseInvoiceId(false)
        } else {
            setButtonLoading(false)
        }

        alert(parsedResponse.message)
    }

    function handleRegisterUsername() {
        if (npub.includes("npub")) {
            registerUsernameAndNpub(npub)
        } else {
            alert("Invalid npub")
        }
    }

    return (
        <>
            <Head>
                <title>William Nostr Verification</title>
                <meta
                    name='description'
                    content='Verify your nostr account for free with william.bet'
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <Center marginTop={8}>
                <VStack>
                    <Heading as='h1'>@william.bet</Heading>
                    <Heading as='h2'>Nostr Free Verification</Heading>
                    <InputGroup size='sm'>
                        <Input
                            value={username}
                            onChange={e => handleChangeInput(e)}
                            variant='filled'
                            disabled={usernameChecked}
                            placeholder='myname'
                        />
                        <InputRightAddon children='@william.bet' />
                    </InputGroup>
                    <InputGroup size='sm'>
                        <Input
                            hidden={!usernameChecked}
                            variant='filled'
                            value={npub}
                            onChange={e => handleChangeNpub(e)}
                            placeholder='Nostr pubkey, npub1'
                        />
                    </InputGroup>
                    <VStack hidden={!responseInvoiceId}>
                        <Text fontSize='md'>
                            Copie the invoice below or scan the code to pay,
                            once paid click register username to verify your
                            nostr account.
                        </Text>
                        <QRCode value={responsePaymentRequest} />
                        <b>Pay Only 1 sat</b>
                        <InputGroup size='sm'>
                            <Input
                                hidden={!usernameChecked}
                                variant='filled'
                                value={responsePaymentRequest}
                                onChange={e => handleChangeNpub(e)}
                                placeholder='Nostr pubkey, npub1'
                            />
                        </InputGroup>
                    </VStack>
                    <Button
                        onClick={e =>
                            usernameChecked
                                ? handleRegisterUsername()
                                : handleCheckUsername()
                        }
                        isLoading={buttonLoading}>
                        {buttonText}
                    </Button>
                </VStack>
            </Center>
        </>
    )
}
