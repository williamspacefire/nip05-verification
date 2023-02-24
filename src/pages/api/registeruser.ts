import checkIfUsernameExists from "@/lib/database/checkusername"
import registerUser from "@/lib/database/registeruser"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
    registered: boolean
    error: boolean
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const reqBody = JSON.parse(req.body)

    if (reqBody.user && reqBody.npub) {
        const username = reqBody.user
        const npub = reqBody.npub

        if (!(await checkIfUsernameExists(username))) {
            await registerUser(username, npub)

            res.status(200).json({
                registered: true,
                error: false,
                message: `User registered, you can use ${username}@william.bet as your NIP05`,
            })
        } else {
            res.status(200).json({
                registered: false,
                error: true,
                message:
                    "This username already exists, please choose a new one",
            })
        }
    } else {
        res.status(200).json({
            registered: false,
            error: true,
            message: "Please, privide a username and npub",
        })
    }
}
