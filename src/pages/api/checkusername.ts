import checkIfUsernameExists from "@/lib/database/checkusername"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
    exists: boolean
    error: boolean
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const reqBody = JSON.parse(req.body)

    if (reqBody.user) {
        const username = reqBody.user
        res.status(200).json({
            exists: await checkIfUsernameExists(username),
            error: false,
            message: "Verified, no error",
        })
    } else {
        res.status(200).json({
            exists: false,
            error: true,
            message: "Please, privide a username to verify",
        })
    }
}
