import { connection } from "./connection"

export default async function getUserInfo(username: string) {
    const [rows, fields] = await (
        await connection
    ).execute(
        "SELECT username, pubkey FROM usernames WHERE username = ? LIMIT 1",
        [username]
    )

    return {
        username: rows[0].username,
        pubkey: rows[0].pubkey,
    }
}
