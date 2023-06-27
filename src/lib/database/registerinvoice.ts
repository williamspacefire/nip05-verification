import { addDoc, collection } from "firebase/firestore"
import { firebaseDatabase } from "./connection"
import getInvoiceIdByHash from "./getinvoiceid"

export default async function registerInvoiceAndCheckIfWasSaved(
    payment_request: string,
    payment_hash: string,
    memo: string,
    amount: number
) {
    await addDoc(collection(firebaseDatabase, "invoice"), {
        payment_hash: payment_hash,
        payment_request: payment_request,
        memo: memo,
        amount: amount,
    })

    return await getInvoiceIdByHash(payment_hash)
}
