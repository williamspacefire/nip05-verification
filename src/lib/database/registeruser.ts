import { connection } from "./connection"

export default async function registerUser(username: string, npub: string) {
    await (
        await connection
    ).execute(
        "INSERT INTO `usernames` (`username`, `pubkey`, `paid`, `ammount_paid`) VALUES (?,?,?,?)",
        [username, npub, 0, 0.00000001]
    )
}
