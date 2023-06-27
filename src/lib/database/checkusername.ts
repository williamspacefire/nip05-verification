import { firebaseDatabase } from "./connection"
import { collection, query, where, getDocs } from "firebase/firestore"

export default async function checkIfUsernameExists(
    username: string
): Promise<boolean> {
    const q = query(
        collection(firebaseDatabase, "usernames"),
        where("username", "==", username)
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.size > 0
}
