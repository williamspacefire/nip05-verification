import { doc, getDoc } from "firebase/firestore"
import { firebaseDatabase } from "./connection"

export default async function getPaymentHash(invoice_id: string) {
    const invoicesRef = doc(firebaseDatabase, "invoice", invoice_id)
    const invoiceSnapshot = await getDoc(invoicesRef)

    return invoiceSnapshot.exists()
        ? invoiceSnapshot.data().payment_hash
        : false
}
