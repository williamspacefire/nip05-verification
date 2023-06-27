import { addDoc, collection } from "firebase/firestore"
import { firebaseDatabase } from "./connection"

export default async function registerUser(username: string, npub: string) {
    addDoc(collection(firebaseDatabase, "usernames"), {
        username: username,
        pubkey: npub,
        paid: (0).toString(),
        ammount_paid: (0.00000001).toString(),
    })
}
