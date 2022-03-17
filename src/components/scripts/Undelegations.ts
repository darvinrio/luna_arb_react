import { LCDClient } from "@terra-money/terra.js";

import {
    LidoState,
    LidoParams,
    LidoUndelegations,
    StaderUndelegation,
    StaderBatchDetails,
    PrismState,
    PrismParams,
    PrismUndelegations,
} from "./minterInterfaces"

const lcd = new LCDClient({
    URL: 'https://lcd.terra.dev',
    chainID: 'columbus-5'
})

// const options = {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
// }

const minter = {
    "lido": "terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts",
    "stader": "terra1xacqx447msqp46qmv8k2sq6v5jh9fdj37az898",
    "prism": "terra1xw3h7jsmxvh6zse74e4099c6gl03fnmxpep76h",
}

export interface RedeemOut {
    "redeemLuna": number,
    "releaseTime": Date,
    "token": string
}

function createDate(timestamp: number) {
    let date: Date

    if (isNaN(timestamp)) {
        date = new Date(0)
    } else {
        if (timestamp < Math.pow(10, 10)) {
            date = new Date(timestamp * 1000)
        }
        else {
            date = new Date(timestamp / 1000000)
        }
    }

    return date
}

async function lidoLunaRedeem(
    user: string,
    minter: string,
) {

    const state: LidoState = await lcd.wasm.contractQuery(
        minter,
        {
            "state": {}
        }
    )

    const params: LidoParams = await lcd.wasm.contractQuery(
        minter,
        {
            "parameters": {}
        }
    )

    let pending: LidoUndelegations = await lcd.wasm.contractQuery(
        minter,
        {
            "unbond_requests": {
                "address": user
            }
        },
    )

    const output = pending.requests.map(request => {

        let batch_id = request[0]
        let blunaAmt = parseInt(request[1]) / Math.pow(10, 6)
        let stlunaAmt = parseInt(request[2]) / Math.pow(10, 6)

        let last_undelegation_id = state.last_processed_batch
        let last_undelegation_time = state.last_unbonded_time
        let epoch_period = params.epoch_period

        let releaseTime = (epoch_period * (batch_id - last_undelegation_id)) + last_undelegation_time
        let releaseDate = createDate(releaseTime)

        if (stlunaAmt == 0) {
            return [{
                "redeemLuna": blunaAmt,
                // "redeemstLuna": stlunaAmt,
                "releaseTime": releaseDate,
                "token": "bluna"
            }]
        } else if (blunaAmt == 0) {
            return [{
                // "redeemluna": blunaAmt,
                "redeemLuna": stlunaAmt,
                "releaseTime": releaseDate,
                "token": "stluna"
            }]
        } else {
            return [{
                "redeemLuna": blunaAmt,
                // "redeemstLuna": stlunaAmt,
                "releaseTime": releaseDate,
                "token": "bluna"
            },
            {
                // "redeemluna": blunaAmt,
                "redeemLuna": stlunaAmt,
                "releaseTime": releaseDate,
                "token": "stluna"
            }]
        }
    })


    return output
}

async function staderLunaRedeem(
    user: string,
    minter: string,
) {

    let pending: StaderUndelegation[] = await lcd.wasm.contractQuery(
        minter,
        {
            "get_user_undelegation_records": {
                "user_addr": user
            }
        },
    )

    let output = await Promise.all(
        pending.map(async request => {

            let batch_id = request.batch_id
            let lunaXAmt = parseInt(request.token_amount)

            const batchDetails: StaderBatchDetails = await lcd.wasm.contractQuery(
                minter,
                {
                    "batch_undelegation": {
                        "batch_id": batch_id
                    }
                },
            )

            let redeemRate = parseFloat(batchDetails.batch.undelegation_er)
            let redeemLuna = (lunaXAmt * redeemRate) / Math.pow(10, 6)

            let releaseTime = batchDetails.batch.est_release_time
            let releaseDate = createDate(parseInt(releaseTime))


            return {
                "redeemLuna": redeemLuna,
                "releaseTime": releaseDate,
                "token": "lunax"
            }

        })
    )

    return output
}

async function prismLunaRedeem(
    user: string,
    minter: string,
) {

    const state: PrismState = await lcd.wasm.contractQuery(
        minter,
        {
            "state": {}
        }
    )

    const params: PrismParams = await lcd.wasm.contractQuery(
        minter,
        {
            "parameters": {}
        }
    )

    let pending: PrismUndelegations = await lcd.wasm.contractQuery(
        minter,
        {
            "unbond_requests": {
                "address": user
            }
        },
    )

    const output = pending.requests.map(request => {

        let batch_id = request[0]
        let clunaAmt = parseInt(request[1]) / Math.pow(10, 6)
        // let stlunaAmt = request[2] / Math.pow(10,6)

        let last_undelegation_id = state.last_processed_batch
        let last_undelegation_time = state.last_unbonded_time
        let epoch_period = params.epoch_period

        let releaseTime = (epoch_period * (batch_id - last_undelegation_id)) + last_undelegation_time
        let releaseDate = createDate(releaseTime)


        return {
            "redeemLuna": clunaAmt,
            "releaseTime": releaseDate,
            "token": "cluna"
        }
    })


    return output
}

export async function undelegations(
    user: string | null
): Promise<RedeemOut[]> {

    let out: RedeemOut[] = []

    let lidoRedeems: (RedeemOut[])[] = await lidoLunaRedeem(user!, minter.lido)
    let staderRedeems: RedeemOut[] = await staderLunaRedeem(user!, minter.stader)
    let prismRedeems: RedeemOut[] = await prismLunaRedeem(user!, minter.prism)

    return (out.concat.apply([], lidoRedeems)).concat(staderRedeems, prismRedeems)

}

// redeemLuna("terra1jse8nzxu5uf9tq5m4rw9v0hhqcfutahay6zj74")
//     .then(value => {
//         console.log(value)
//     })