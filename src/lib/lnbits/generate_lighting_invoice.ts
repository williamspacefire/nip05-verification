export default async function generateLightingInvoice(
    memo: string,
    amount: number
) {
    const response = await fetch("https://legend.lnbits.com/api/v1/payments", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            "X-Api-Key": process.env.LNBITS_API_KEY as string,
        }),
        body: JSON.stringify({
            amount: amount,
            memo: memo,
            out: false,
        }),
    })

    return await response.json()
}
