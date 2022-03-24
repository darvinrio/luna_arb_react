import { MsgSend, MsgExecuteContract } from '@terra-money/terra.js';

import { route, routeSwap } from './HopSwap';

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
            "belief_price": belief_price.toString(),
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
    route: route
) {
    let amount: string = (amt * Math.pow(10, 6)).toString()

    let query = routeSwap(
        amt,
        route.protocol,
        route.route,
        false
    )

    let msg = query

    let tx_msg: MsgExecuteContract = new MsgExecuteContract(
        user, // sender
        route.router, // contract account address
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

export function buildNoHopSwapTx(
    user: string,
    lpContract: string | null | undefined,
    targetAsset: string,
    swapAmount: number,
    // expSwapOutAmount: number,
    redeemAmount: number,
    minter: string
) {

    // if(lpContract===null || lpContract===undefined){
    //     return null
    // } 

    let belief_price = swapAmount / redeemAmount

    let swapTx: MsgExecuteContract = NoHopSwapTx(
        user,
        swapAmount,
        lpContract!,
        belief_price,
    )

    let redeemTx: MsgExecuteContract = initiateRedeem(
        user,
        redeemAmount,
        targetAsset,
        minter
    )

    return [swapTx, redeemTx]
}

export function buildHopSwapTx(
    user: string,
    targetAsset: string,
    route: route,
    swapAmount: number,
    redeemAmount: number,
    minter: string,
) {

    let swapTx: MsgExecuteContract = HopSwapTx(
        user,
        swapAmount,
        route
    )

    //nLuna condition
    if (targetAsset === "terra10f2mt82kjnkxqj2gepgwl637u2w4ue2z5nhz5j") {

        let msg = createHookMsg({ "withdraw": {} })

        let withdrawTx: MsgExecuteContract = new MsgExecuteContract(
            user,
            targetAsset,
            {
                "send": {
                    "msg": msg,
                    "amount": Math.floor(redeemAmount * Math.pow(10, 6)).toString(),
                    "contract": "terra1cda4adzngjzcn8quvfu2229s8tedl5t306352x"
                }
            }
        )

        let redeemTx: MsgExecuteContract = initiateRedeem(
            user,
            redeemAmount,
            "terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp", //bluna
            "terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts" //bluna hub
        )

        return [swapTx, withdrawTx, redeemTx]
    } else {

        let redeemTx: MsgExecuteContract = initiateRedeem(
            user,
            redeemAmount,
            targetAsset,
            minter
        )

        return [swapTx, redeemTx]
    }
}
