import React from "react"
import checkIfUsernameExists from "../../../lib/database/checkusername"
import getUserInfo from "../../../lib/database/getuserinfo"

export default function NostrJson() {
    return <h1></h1>
}

export async function getServerSideProps({ req, res, query }) {
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "max-age=1704085200")

    if (query.name) {
        if (await checkIfUsernameExists(query.name)) {
            const userInfo = await getUserInfo(query.name)
            res.write(`{"names":{"${userInfo.username}":"${userInfo.pubkey}"}}`)
        } else {
            res.write(
                JSON.stringify({
                    error: "User not found in this server",
                })
            )
        }
    } else {
        res.write(
            JSON.stringify({
                error: "Please pass a ?name=<username> as a params in the url",
            })
        )
    }
    res.end()

    return {
        props: {},
    }
}
