import { Component } from 'react'
import styled from 'styled-components';

import {
    SwapSimJSON,
    noHopStack,
    hopStack
} from './scripts/NoHopSwap';
import {
    routeAsset,
    route,
    routeSwap
} from './scripts/HopSwap';
import {
    buildNoHopSwapTx,
    buildHopSwapTx
} from './scripts/TxBuilder';

import { Amount } from './Amount';
import { SendTx } from './SendTx';

import noHop from "../json/noHop.json"
import { MsgExecuteContract } from '@terra-money/terra.js';
// import { Button } from './styles/Button.style';

interface noHopState {
    best: {
        token: string,
        pool?: string,
        apr: string,
        pr: string,
        msg?: MsgExecuteContract[]
    },
    amount: number,
    div_token_list: any,
}

interface props {
    simAmt: number,
    walletAddr: string
}

interface pool {
    dex: string,
    address: string
}


interface token {
    id: string,
    token_addr: string,
    minter: string,
    pools: pool[],
    hops: route[],
    rate_cmd: string
}

export class Swaps extends Component<props, { data: noHopState, DataisLoaded: boolean }> {
    constructor(props: any = {}) {
        super(props);

        this.state = {
            data: {
                "best": {
                    token: "yolo",
                    apr: "0",
                    pr: '0',
                },
                "amount": 10,
                "div_token_list": null
            },
            DataisLoaded: false
        };

    }

    handleNoHopStack(
        swapSimJSON: SwapSimJSON,
        dex: string,
        token: string
    ) {

        let msg = buildNoHopSwapTx(
            this.props.walletAddr,
            swapSimJSON.lpContract,
            swapSimJSON.token!,
            this.state.data.amount,
            parseFloat(swapSimJSON.swapReturn!),
            swapSimJSON.minter!
        )

        let disable: boolean = (parseFloat(swapSimJSON.redeemAPR) <= 10) ? true : false


        if (parseFloat(swapSimJSON.redeemAPR) > parseFloat(this.state.data.best.apr)) {
            let temp = this.state.data
            temp.best = {
                token: token,
                pool: dex,
                apr: swapSimJSON.redeemAPR,
                pr: swapSimJSON.returnPR,
                msg: msg
            }
            this.setState({
                data: temp,
                DataisLoaded: false
            });
        }
        return (
            <div key={Math.random()}>
                <SwapInfo>
                    <>
                        {dex}
                        <p>
                            {'pool'}
                        </p>
                    </>
                    <p>
                        swap output : {swapSimJSON.swapReturn} <br />
                        LUNA redeemed : {swapSimJSON.swapRedeem} <br />
                        swap rate : {swapSimJSON.returnPR} % <br />
                        annual rate : {swapSimJSON.redeemAPR} %
                    </p>
                    <SendTx msg={msg} disable={disable} />
                </SwapInfo>
            </div>
        )
    }

    handleHopStack(
        swapSimJSON: SwapSimJSON,
        token: string,
        dex: string,
        route: route,
        minter: string
    ) {
        let msg = buildHopSwapTx(
            this.props.walletAddr,
            token,
            route,
            this.state.data.amount,
            parseFloat(swapSimJSON.swapReturn!),
            minter
        )

        let routeStr: string = ''
        route.route.map(asset => {
            routeStr += (asset.token + '>')
        })

        // let disable = false
        let disable: boolean = (parseFloat(swapSimJSON.redeemAPR) <= 10) ? true : false

        if (parseFloat(swapSimJSON.redeemAPR) > parseFloat(this.state.data.best.apr)) {
            let temp = this.state.data
            temp.best = {
                token: token,
                pool: dex,
                apr: swapSimJSON.redeemAPR,
                pr: swapSimJSON.returnPR,
                msg: msg
            }
            this.setState({
                data: temp,
                DataisLoaded: false
            });
        }
        return (
            <div key={Math.random()}>
                <SwapInfo>
                    <>
                        {dex}
                        <p>
                            {routeStr}
                        </p>
                    </>
                    <p>
                        swap output : {swapSimJSON.swapReturn} <br />
                        LUNA redeemed : {swapSimJSON.swapRedeem} <br />
                        swap rate : {swapSimJSON.returnPR} % <br />
                        annual rate : {swapSimJSON.redeemAPR} %
                    </p>
                    <SendTx msg={msg} disable={disable} />
                </SwapInfo>
            </div>
        )
    }

    async allPools(
        token: token
    ) {
        const pool_div = await Promise.all(token.pools.map(async pool => {
            return this.handleNoHopStack(
                await noHopStack(
                    pool.address,
                    token.token_addr,
                    this.state.data.amount,
                    token.minter,
                    token.rate_cmd
                ),
                pool.dex,
                token.id
            )
        }))

        return pool_div
    }

    async allHops(
        token: token
    ) {
        const hop_div = await Promise.all(token.hops.map(async hop => {
            return this.handleHopStack(
                await hopStack(
                    this.state.data.amount,
                    hop,
                    token.minter,
                    token.rate_cmd,
                ),
                token.token_addr,
                hop.protocol,
                hop,
                token.minter
            )
        }))

        return hop_div
    }

    async allTokens() {
        const token_div = await Promise.all(noHop.map(async token => {

            return (
                <>
                    <h2>{token.id}</h2>
                    <TokenSwaps>
                        {await this.allPools(token)}
                        {await this.allHops(token)}
                    </TokenSwaps>
                </>
            )
        }))

        return token_div
    }

    componentDidUpdate(prevProps: props) {
        if (prevProps.walletAddr !== this.props.walletAddr) {
            this.componentDidMount()
        }
    }

    componentDidMount() {

        this.allTokens()//("astroport")
            .then(value => {
                let temp = this.state.data
                temp.div_token_list = value
                this.setState({
                    data: temp,
                    DataisLoaded: true
                });
            })

    }

    setSimAmtFirst(amt: number) {
        console.log('lol')
    }

    setSimAmt(amt: number) {

        let temp = this.state.data

        temp.amount = amt
        temp.best = {
            token: "yolo",
            apr: "0",
            pr: '0'
        }
        temp.div_token_list = null

        this.setState({
            data: temp,
            DataisLoaded: false
        })

        this.componentDidMount()

    }

    render() {

        const { DataisLoaded, data }: any = this.state;

        if (!DataisLoaded) {
            return (
                <div>
                    <Amount simAmt={this.state.data.amount} setSimAmt={this.setSimAmtFirst} />
                    <h1> Please wait some time.... </h1>
                </div>
            )
        } else {
            return (
                <div>
                    <Amount simAmt={this.state.data.amount} setSimAmt={this.setSimAmt.bind(this)} />
                    <BestSwap>
                        <h1>
                            Best rate: <br />
                            {this.state.data.best.pr}% or {this.state.data.best.apr}% APR<br />
                            {this.state.data.best.token} {" on "}
                            {this.state.data.best.pool}
                        </h1>
                        <SendTx msg={this.state.data.best.msg!} disable={false} />
                    </BestSwap>
                    {data.div_token_list}
                </div>
            )
        }

    }
}

const TokenSwaps = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit,min(400px));
    justify-self:start;

    @media (max-width: 900px){
        grid-template-columns: 1fr;
        justify-self:center;
  }
`

const SwapInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:space-between;
    
    border: 1px solid;
    border-radius: 50px; 
    margin: 30px;
    padding: 30px; 

`

const BestSwap = styled.div`
    display: flex;
    flex-direction:row;
    align-items: flex-end;
    justify-content:space-between;

    @media (max-width: 700px){
        flex-direction:column;
        align-items:flex-start;
        justify-content: left;
  }
`