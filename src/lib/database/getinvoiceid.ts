import { collection, getDocs, query, where } from "firebase/firestore"
import { firebaseDatabase } from "./connection"

export default async function getInvoiceIdByHash(payment_hash: string) {
    const q = query(
        collection(firebaseDatabase, "invoice"),
        where("payment_hash", "==", payment_hash)
    )
    const invoiceSnapshot = await getDocs(q)

    return invoiceSnapshot.size > 0 ? invoiceSnapshot.docs[0].id : false
}
