import { connection } from "./connection"

export default async function getPaymentHash(invoice_id: number) {
    const [rows, fields] = await (
        await connection
    ).execute("SELECT payment_hash FROM invoice WHERE id = ? LIMIT 1", [
        invoice_id,
    ])

    return rows.length > 0 ? rows[0].payment_hash : false
}
