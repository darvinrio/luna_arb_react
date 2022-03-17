import { MsgSend, MsgExecuteContract } from '@terra-money/terra.js';

import { createHookMsg } from './utils';

interface hopJsonMsg {
    offer_amount: string,
    operations: JSON[]
}

export function NoHopSwapTx(
    user: string,
    amt: number,
    contract: string,
    belief_price: number
) {

    let amount: string = (amt * Math.pow(10, 6)).toString()

    let msg = {
        "swap": {
            "belief_price":belief_price.toString(),
            "max_spread": "0.001",
            "offer_asset": {
                "info": {
                    "native_token": {
                        "denom": "uluna"
                    }
                },
                "amount": amount
            }
        }
    }

    let tx_msg: MsgExecuteContract = new MsgExecuteContract(
        user, // sender
        contract, // contract account address
        msg, // handle msg
        { uluna: amount }
    )

    return tx_msg

}

export function HopSwapTx(
    user: string,
    amt: number,
    router: string,
    query: hopJsonMsg
) {
    let amount: string = (amt * Math.pow(10, 6)).toString()
    query.offer_amount = amount

    let msg = {
        "swap": query
    }

    let tx_msg: MsgExecuteContract = new MsgExecuteContract(
        user, // sender
        router, // contract account address
        msg, // handle msg
        { uluna: amount }
    )

    return tx_msg

}

/*
{"queue_undelegate":{}} --  lunaX
{"unbond":{}}           --  cluna
{"unbond":{}}           --  bluna
{"unbond":{}}           --  stluna
*/
export function initiateRedeem(
    user: string,
    amt: number,
    token: string,
    minter: string
) {
    let amount: string = (amt * Math.pow(10, 6)).toString()

    let hex_msg = createHookMsg(
        (
            token === "terra17y9qkl8dfkeg4py7n0g5407emqnemc3yqk5rup"
                ? { "queue_undelegate": {} }
                : { "unbond": {} }
        )
    )

    let msg = {
        "send": {
            "msg": hex_msg,
            "amount": amount,
            "contract": minter
        }
    }

    let tx_msg = new MsgExecuteContract(
        user,
        token,
        msg
    )

    return tx_msg

}

export function buildTransaction(
    user:string,
    lpContract: string|null|undefined,
    targetAsset: string,
    swapAmount: number,
    // expSwapOutAmount: number,
    redeemAmount: number,
    minter: string
){

    // if(lpContract===null || lpContract===undefined){
    //     return null
    // } 

    let belief_price = swapAmount/redeemAmount

    let swapTx:MsgExecuteContract = NoHopSwapTx(
        user,
        swapAmount,
        lpContract!,
        belief_price,
    )

    let redeemTx:MsgExecuteContract = initiateRedeem(
        user,
        redeemAmount,
        targetAsset,
        minter
    )

    return [swapTx,redeemTx]
}
