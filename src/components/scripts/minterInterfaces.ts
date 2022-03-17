export interface LidoState {
    "exchange_rate": string,
    "total_bond_amount": string,
    "last_index_modification": number,
    "prev_vault_balance": string,
    "actual_unbonded_amount": string,
    "last_unbonded_time": number,
    "last_processed_batch": number
}

export interface LidoParams {
    "epoch_period": number,
    "er_threshold": string,
    "peg_recovery_fee": string,
    "reward_denom": string,
    "unbonding_period": number,
    "underlying_coin_denom": string,
    "validator": string
}

export interface LidoUndelegations {
    "address": string,
    "requests":
    [
        number,
        string,
        string
    ][]

}



export interface StaderUndelegation {
    "batch_id": number,
    "token_amount": string
}

export interface StaderBatchDetails {
    "batch": {
        "undelegated_tokens": string,
        "create_time": string,
        "est_release_time": string,
        "reconciled": boolean,
        "undelegation_er": string,
        "undelegated_stake": string,
        "unbonding_slashing_ratio": string
    }
}



export interface PrismState {
    "exchange_rate": string,
    "total_bond_amount": string,
    "last_index_modification": number,
    "prev_vault_balance": string,
    "actual_unbonded_amount": string,
    "last_unbonded_time": number,
    "last_processed_batch": number
}

export interface PrismParams {
    "epoch_period": number,
    "er_threshold": string,
    "peg_recovery_fee": string,
    "reward_denom": string,
    "unbonding_period": number,
    "underlying_coin_denom": string,
    "validator": string
}

export interface PrismUndelegations {
    "address": string,
    "requests":
    [
        number,
        string
    ][]

}