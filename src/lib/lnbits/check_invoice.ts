export default async function checkLightingInvoice(payment_hash: string) {
    const response = await fetch(
        "https://legend.lnbits.com/api/v1/payments/" + payment_hash,
        {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "X-Api-Key": process.env.LNBITS_API_KEY as string,
            }),
        }
    )

    return await response.json()
}
