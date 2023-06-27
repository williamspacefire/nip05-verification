import checkIfUsernameExists from "@/lib/database/checkusername"
import registerInvoiceAndCheckIfWasSaved from "@/lib/database/registerinvoice"
import generateLightingInvoice from "@/lib/lnbits/generate_lighting_invoice"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
    exists: boolean
    error: boolean
    message: string
    invoice_id: string | boolean
    payment_request: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const reqBody = JSON.parse(req.body)

    if (reqBody.user && !(await checkIfUsernameExists(reqBody.user))) {
        const username = reqBody.user

        const memo = `${username}@william.bet`
        const amount = 1 //sats

        const lightingInvoice = await generateLightingInvoice(memo, amount)
        const invoiceId = await registerInvoiceAndCheckIfWasSaved(
            lightingInvoice.payment_request,
            lightingInvoice.payment_hash,
            memo,
            amount
        )

        res.status(200).json({
            exists: false,
            error: false,
            message: "Verified, no error",
            invoice_id: invoiceId,
            payment_request: lightingInvoice.payment_request,
        })
    } else {
        res.status(200).json({
            exists: true,
            error: true,
            message: "Username already exists, choose a new one",
            invoice_id: false,
            payment_request: "",
        })
    }
}
