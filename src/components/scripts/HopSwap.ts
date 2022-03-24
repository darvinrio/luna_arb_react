export interface routeAsset {
    token:string,
    contract: string, // asset contract
    is_native_swap: boolean
}

export interface route {
    protocol: string,
    protocol_name:string,
    router:string,
    route: routeAsset[]
}

export function routeSwap(
    amount: number,
    protocol: string,
    route: routeAsset[],
    sim: boolean
) {

    const out = route.map((asset, index) => {

        if (index === 0) return;

        let swap_type = (asset.is_native_swap) ? 'native' : protocol

        let asset_from = route[index - 1].contract
        let asset_to = asset.contract

        if (protocol === 'prism') {
            let asset_from_type = (asset_from[0] == 'u') ? 'native' : 'cw20'
            let asset_to_type = (asset_to[0] == 'u') ? 'native' : 'cw20'

            if (asset.is_native_swap) {
                return {
                    [swap_type + '_swap']: {
                        "ask_denom": asset_to,
                        "offer_denom": asset_from
                    }
                }
            } else {
                return {
                    [swap_type + '_swap']: {
                        "ask_asset_info": {
                            [asset_to_type]: asset_to
                        },
                        "offer_asset_info": {
                            [asset_from_type]: asset_from
                        }
                    }
                }
            }
        } else {
            let asset_from_type = (asset_from[0] == 'u') ? 'native_token' : 'token'
            let asset_to_type = (asset_to[0] == 'u') ? 'native_token' : 'token'

            if (asset.is_native_swap) {
                return {
                    [swap_type + '_swap']: {
                        "ask_denom": asset_to,
                        "offer_denom": asset_from
                    }
                }
            } else {
                return {
                    [swap_type + '_swap']: {
                        "ask_asset_info": {
                            [asset_to_type]: {
                                [(asset_to_type === 'token')?'contract_addr':'denom'] : asset_to
                            } 
                        },
                        "offer_asset_info": {
                            [asset_from_type]: {
                                [(asset_from_type === 'token')?'contract_addr':'denom'] : asset_from
                            } 
                        }
                    }
                }
            }
        }
    })

    let operation: string = "execute_swap_operations"
    if (sim) {
        operation = "simulate_swap_operations"
    }

    return {
        [operation]: {
            offer_amount: (amount * Math.pow(10, 6)).toString(),
            operations: out.slice(1)
        }
    }
}

// console.log(routeSwap(
//     10,
//     'prism',
//     [
//         {
//             contract: 'uluna',
//             is_native_swap: true
//         },
//         {
//             contract: 'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw', //prism
//             is_native_swap: false
//         },
//         {
//             contract: 'terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau', //cluna
//             is_native_swap: false
//         }
//     ],
//     false
// ))