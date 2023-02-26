import { connection } from "./connection"
import getInvoiceIdByHash from "./getinvoiceid"

export default async function registerInvoiceAndCheckIfWasSaved(
    payment_request: string,
    payment_hash: string,
    memo: string,
    amount: number
) {
    await (
        await connection
    ).execute(
        "INSERT INTO `invoice` (`payment_hash`, `payment_request`, `memo`, `amount`) VALUES (?,?,?,?)",
        [payment_hash, payment_request, memo, amount]
    )

    return await getInvoiceIdByHash(payment_hash)
}
