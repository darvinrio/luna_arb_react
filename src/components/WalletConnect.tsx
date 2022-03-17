// import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import {
    useWallet,
    WalletStatus,
    useConnectedWallet,
    useLCDClient
} from '@terra-money/wallet-provider';

import { QuerySample } from './QueryBal';

import { Button } from './styles/Button.style';

export function WalletConnect({setWallet}:any) {

    const {
        status,
        connect,
        disconnect,
        // connection,
        // wallets,
        // network,
        availableConnectTypes,
        // availableConnections,
        // availableInstallations,
        // supportFeatures,
    } = useWallet();

    const lcd = useLCDClient();
    const connectedWallet = useConnectedWallet();
    // console.log(connectedWallet?.walletAddress)


    switch (status) {
        case WalletStatus.INITIALIZING:
            return (
                <WalletGrid>
                    <Button
                        bg="white"
                    >
                        Initializing
                    </Button>
                    <div>
                        {connectedWallet?.walletAddress} -  not connected
                    </div>
                </WalletGrid>
            )
        case WalletStatus.WALLET_NOT_CONNECTED:
            return (
                <WalletGrid>

                    <Button
                        bg="#91C483"
                        onClick={() => { connect(availableConnectTypes[0]) }}
                    >
                        Connect
                    </Button>
                    <div>
                        {connectedWallet?.walletAddress} - not connected
                    </div>
                </WalletGrid>
            )
        case WalletStatus.WALLET_CONNECTED:
            setWallet(connectedWallet?.walletAddress)
            return (
                <WalletGrid>
                    <Button
                        bg='#FF6464'
                        onClick={disconnect}
                    >
                        Disconnect
                    </Button>
                    <div>
                        {"terra..."+connectedWallet?.walletAddress.substring(38)} -  <QuerySample />
                    </div>
                </WalletGrid>
            )
        default: return null
    }
}



const WalletGrid = styled.div`
    display: flex;
    /* display: grid; */
    /* grid-template-rows: 1fr 1fr; */
    flex-direction: column;
    align-items:center;
    justify-content: left;
    /* flexbox */

    @media (max-width: 700px){
    align-items:center;
    /* justify-content: left; */
  }
`
