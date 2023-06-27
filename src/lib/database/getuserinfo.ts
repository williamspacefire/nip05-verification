import { collection, getDocs, query, where } from "firebase/firestore"
import { firebaseDatabase } from "./connection"

export default async function getUserInfo(username: string) {
    const q = query(
        collection(firebaseDatabase, "usernames"),
        where("username", "==", username)
    )
    const usernameSnapshot = await getDocs(q)

    return {
        username: usernameSnapshot.docs[0].data().username,
        pubkey: usernameSnapshot.docs[0].data().pubkey,
    }
}
