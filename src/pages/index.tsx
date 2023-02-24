import Head from "next/head"
import {
    Input,
    Heading,
    Center,
    VStack,
    InputGroup,
    InputRightAddon,
    Button,
} from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { nip19 } from "nostr-tools"

export default function Home() {
    const checkUsernameEndpoint = "/api/checkusername"
    const registerUserEndpoint = "/api/registeruser"
    const buttontexts = ["Check Username", "Register Username"]

    const [usernameChecked, setUsernameChecked] = useState(false)
    const [finishedRegister, setFinishedRegister] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [buttonText, setButtonText] = useState(buttontexts[0])
    const [username, setUsername] = useState("")
    const [npub, setNpub] = useState("")

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
        const parsedResponse = await response.json()

        setButtonLoading(false)

        if (parsedResponse.exists) {
            alert("Username already exists, choose another one")
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
            body: JSON.stringify({ user: username, npub: userNpub }),
        })
        const parsedResponse = await response.json()

        setUsernameChecked(false)
        setButtonLoading(false)
        setButtonText(buttontexts[0])
        setUsername("")
        setNpub("")
        alert(parsedResponse.message)
    }

    function handleRegisterUsername() {
        if (nip19.decode(npub).type === "npub") {
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
