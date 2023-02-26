import { connection } from "./connection"

export default async function getInvoiceIdByHash(payment_hash: string) {
    const [rows, fields] = await (
        await connection
    ).execute("SELECT id FROM invoice WHERE payment_hash = ? LIMIT 1", [
        payment_hash,
    ])

    return rows.length > 0 ? rows[0].id : false
}
