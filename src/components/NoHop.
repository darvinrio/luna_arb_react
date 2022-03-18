import { Component } from 'react'
import styled from 'styled-components';

import {
    SwapSimJSON,
    noHopStack,
    hopStack
} from './scripts/NoHopSwap';
import {
    buildTransaction
} from './scripts/TxBuilder';

import { Amount } from './Amount';
import { SendTx } from './SendTx';

import noHop from "../json/noHop.json"
import Hop from "../json/Hop.json"
import { MsgExecuteContract } from '@terra-money/terra.js';
// import { Button } from './styles/Button.style';

interface noHopState {
    best: {
        token: string,
        pool?: string,
        apr: string,
        pr:string,
        msg?: MsgExecuteContract[]
    },
    amount: number,
    div_token_list: any,
}

interface props {
    simAmt: number,
    walletAddr: string
}

export class NoHop extends Component<props, { data: noHopState, DataisLoaded: boolean }> {
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

        let msg = buildTransaction(
            // "terra...",
            this.props.walletAddr,
            swapSimJSON.lpContract,
            swapSimJSON.token!,
            this.state.data.amount,
            // parseFloat(swapSimJSON.swapReturn!),
            parseFloat(swapSimJSON.swapReturn!),
            swapSimJSON.minter!
        )

        let disable: boolean = (parseFloat(swapSimJSON.redeemAPR) <= 10) ? true : false

        if (!(swapSimJSON.poolExists)) {
            return (
                <div>
                    Nope
                </div>
            )
        } else {
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
                    DataisLoaded: true
                });
            }

            return (
                <div key={Math.random()}>
                    <SwapInfo>
                        <p>
                            Output from swap : {swapSimJSON.swapReturn} <br />
                            LUNA on redeem : {swapSimJSON.swapRedeem} <br />
                            Swap Return rate : {swapSimJSON.returnPR} % <br />
                            APR : {swapSimJSON.redeemAPR} %
                        </p>
                        <SendTx msg={msg} disable={disable} />
                    </SwapInfo>
                </div>
            )
        }
    }

    async getPrices(dex: string) {
        const token_list = await Promise.all(noHop.map(async token => {
            let lpContract: string | null = token.terraswap
            switch (dex) {
                case "loop":
                    lpContract = token.loop
                    break
                case "astroport":
                    lpContract = token.astroport
                    break
            }

            return (
                <div>
                    <div>
                        <div>
                            <h3>{token.id} </h3>
                            {this.handleNoHopStack(
                                await noHopStack(
                                    lpContract,
                                    token.token,
                                    this.state.data.amount,
                                    token.minter,
                                    token.rate
                                ),
                                dex,
                                token.id
                            )}
                        </div>
                        <br />
                    </div>
                </div>
            )
        }))

        return token_list
    }

    async allDex() {

        //noHop first
        let dexes: string[] = ['terraswap', 'astroport', 'loop']

        const dexesList = await Promise.all(dexes.map(async dex => {
            return (
                <div>
                    <h2>{dex}</h2>
                    <br />
                    {await this.getPrices(dex)}
                    <br />
                </div>
            )
        }))

        //Hop
        const hopList = await Promise.all(Hop.map(async route => {
            return (
                <div>
                    <h2>{route.id}</h2>
                    {await this.handleNoHopStack(await hopStack(
                        route.router,
                        route.query,
                        this.state.data.amount,
                        route.minter,
                        route.rate
                    ),
                        route.id,
                        route.symbol
                    )}
                    <br />
                </div>
            )
        }))

        return [dexesList, hopList]
    }

    componentDidUpdate(prevProps: props) {
        if (prevProps.walletAddr !== this.props.walletAddr) {
            this.componentDidMount()
        }
    }

    componentDidMount() {

        this.allDex()//("astroport")
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
            pr:'0'
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
                            {this.state.data.best.token} -
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

const SwapInfo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content:space-between;
    
    /* border: 1px solid;
    border-radius: 50px;
    margin: 30px;
    padding: 30px; */

    @media (max-width: 700px){
    flex-direction:column;
    align-items:flex-start;
    justify-content: left;
  }
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