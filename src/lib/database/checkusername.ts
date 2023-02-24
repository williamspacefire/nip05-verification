import { connection } from "./connection"

export default async function checkIfUsernameExists(
    username: string
): Promise<boolean> {
    const [rows, fields] = await (
        await connection
    ).execute("SELECT username FROM usernames WHERE username = ?", [username])

    return rows.length > 0
}
