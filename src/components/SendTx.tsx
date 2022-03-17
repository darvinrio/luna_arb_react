import { MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import {
    CreateTxFailed,
    Timeout,
    TxFailed,
    TxResult,
    TxUnspecifiedError,
    useConnectedWallet,
    UserDenied,
} from '@terra-money/wallet-provider';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import { Button } from './styles/Button.style';

interface Props {
    msg: MsgSend[] | MsgExecuteContract[],
    disable: boolean
}


export function SendTx(props: Props) {
    const [txResult, setTxResult] = useState<TxResult | null>(null);
    const [txError, setTxError] = useState<string | null>(null);

    let tx_msg = props.msg

    const connectedWallet = useConnectedWallet();
    const theme = useTheme();

    const proceed = useCallback(() => {
        if (!connectedWallet) {
            return;
        }

        if (connectedWallet.network.chainID.startsWith('columbus')) {
            alert(`Please only execute this example on Testnet`);
            return;
        }

        setTxResult(null);
        setTxError(null);

        connectedWallet
            .post({
                msgs: tx_msg
            })
            .then((nextTxResult: TxResult) => {
                console.log(nextTxResult);
                setTxResult(nextTxResult);
            })
            .catch((error: unknown) => {
                if (error instanceof UserDenied) {
                    setTxError('User Denied');
                } else if (error instanceof CreateTxFailed) {
                    setTxError('Create Tx Failed: ' + error.message);
                    // setTxError('Create Tx Failed: ');
                } else if (error instanceof TxFailed) {
                    // setTxError('Tx Failed: ' + error.message);
                    setTxError('Tx Failed: ');
                } else if (error instanceof Timeout) {
                    setTxError('Timeout');
                } else if (error instanceof TxUnspecifiedError) {
                    // setTxError('Unspecified Error: ' + error.message);
                    setTxError('Unspecified Error: ');
                } else {
                    setTxError(
                        'Unknown Error: ' + ''
                        // (error instanceof Error ? error.message : String(error)),
                    );
                }
            });
    }, [connectedWallet,tx_msg]);

    return (
        <Transact>

            <div>

                {connectedWallet?.availablePost && !txResult && !txError && props.disable && (
                    <Button
                        bg={theme.colors.btn_dark}
                        disabled
                        onClick={proceed}
                    >
                        not worth it
                    </Button>
                )}

                {connectedWallet?.availablePost && !txResult && !txError && !props.disable && (
                    <Button
                        bg={theme.colors.btn_light}
                        onClick={proceed}
                    >
                        Stack
                    </Button>
                )}

                {(!!txResult) && (
                    <Button
                        bg={theme.colors.btn_light}
                        onClick={() => {
                            setTxResult(null);
                            setTxError(null);
                        }}
                    >
                        New Arb
                    </Button>
                )}

                {(!!txError) && (
                    <Button
                        bg={theme.colors.btn_light}
                        onClick={() => {
                            setTxResult(null);
                            setTxError(null);
                        }}
                    >
                        Retry
                    </Button>
                )}
            </div>

            <div>
                {connectedWallet?.availablePost && !txResult && !txError &&
                    <p>
                        Click to stack
                    </p>
                }

                {txResult && (
                    <>
                        {/* <pre>{JSON.stringify(txResult, null, 2)}</pre> */}

                        {connectedWallet && txResult && (
                            <div>
                                <a
                                    href={`https://finder.terra.money/${connectedWallet.network.chainID}/tx/${txResult.result.txhash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Open Tx Result in Terra Finder
                                </a>
                            </div>
                        )}
                    </>
                )}

                {txError && <pre>{txError}</pre>}

                {!connectedWallet && <p>Wallet not connected!</p>}

                {connectedWallet && !connectedWallet.availablePost && (
                    <p>This connection does not support post()</p>
                )}
            </div>

        </Transact>
    );
}

const Transact = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`