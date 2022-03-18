import {
    LCDClient,
} from "@terra-money/terra.js";

const lcd = new LCDClient({ URL: 'https://lcd.terra.dev', chainID: 'columbus-5' })


export interface SwapSimJSON {
    "poolExists":boolean,
    "swapReturn":string,
    "swapRedeem":string,
    "redeemAPR":string,
    "returnPR":string,

    "lpContract"?:string|null,
    "token"?:string,
    "minter"?:string
}

async function noHopSimSwap(
    lpContract: string,
    targetAsset: string,
    amount: number
) {
    let sim: any = await lcd.wasm.contractQuery(
        lpContract,
        {
            "simulation": {
                "offer_asset": {
                    "info": {
                        "native_token": {
                            "denom": "uluna"
                        }
                    },
                    "amount": (amount * Math.pow(10, 6)).toString()
                }
            }
        }
    )

    return sim.return_amount / Math.pow(10, 6);
}

async function hopSimSwap(
    router:string,
    query:any
) {
    let sim: any = await lcd.wasm.contractQuery(
        router,
        query
    )

    return sim.amount / Math.pow(10, 6);
}

async function estLunaReturn(
    amount: number,
    minter: string,
    rate: string,
) {
    let state: any = await lcd.wasm.contractQuery(
        minter,
        {
            "state": {}
        }
    )

    return await(amount * eval(rate))

}


export async function noHopStack(
    lpContract: string|null,
    targetAsset: string,
    amount: number,
    minter: string,
    rate: string,
) {
    if (lpContract === null) {
        return {
            "poolExists":false,
            "swapReturn":'0',
            "swapRedeem":'0',
            "redeemAPR":'0',
            "returnPR":'0'
        }
    }
    let swapReturn:number = await noHopSimSwap(lpContract,targetAsset,amount)
    let swapRedeem:number =  await estLunaReturn(swapReturn,minter,rate)
    let redeemAPR:number = (swapRedeem-amount)*365*100/(amount*24)
    let returnPR:number = (swapRedeem-amount)*100/(amount)

    return {
        "poolExists":true,
        "swapReturn":swapReturn.toFixed(6),
        "swapRedeem":swapRedeem.toFixed(6),
        "redeemAPR":redeemAPR.toFixed(2),
        "returnPR":returnPR.toFixed(2),

        "lpContract":lpContract,
        "token":targetAsset,
        "minter":minter
    }
}

export async function hopStack(
    router:string,
    query:any,
    amount: number,
    minter: string,
    rate: string,
) {
    query.simulate_swap_operations.offer_amount = (amount*Math.pow(10,6)).toString()
    
    let swapReturn:number = await hopSimSwap(router,query)
    let swapRedeem:number =  await estLunaReturn(swapReturn,minter,rate)
    let redeemAPR:number = (swapRedeem-amount)*365*100/(amount*24)
    let returnPR:number = (swapRedeem-amount)*100/(amount)
    
    return {
        "poolExists":true,
        "swapReturn":swapReturn.toFixed(6),
        "swapRedeem":swapRedeem.toFixed(6),
        "redeemAPR":redeemAPR.toFixed(2),
        "returnPR":returnPR.toFixed(2)
    }
}
