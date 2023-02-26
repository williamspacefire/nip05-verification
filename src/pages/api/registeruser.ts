import checkIfUsernameExists from "@/lib/database/checkusername"
import registerUser from "@/lib/database/registeruser"
import checkLightingInvoice from "@/lib/lnbits/check_invoice"
import getPaymentHash from "@/lib/database/get_invoice_payment_hash"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
    registered: boolean
    error: boolean
    reset_invoice: boolean
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

        if (!(await checkIfUsernameExists(username)) && reqBody.invoice_id) {
            const check_invoice = await checkLightingInvoice(
                await getPaymentHash(reqBody.invoice_id)
            )

            if (check_invoice.paid) {
                await registerUser(username, npub)

                res.status(200).json({
                    registered: true,
                    error: false,
                    reset_invoice: true,
                    message: `User registered, you can use ${username}@william.bet as your NIP05`,
                })
            } else {
                res.status(200).json({
                    registered: false,
                    error: true,
                    reset_invoice: false,
                    message: `Invoice not paid. Pay the invoice and try again`,
                })
            }
        } else {
            res.status(200).json({
                registered: false,
                error: true,
                reset_invoice: true,
                message:
                    "This username already exists, please choose a new one",
            })
        }
    } else {
        res.status(200).json({
            registered: false,
            error: true,
            reset_invoice: true,
            message: "Please, privide a username and npub",
        })
    }
}
