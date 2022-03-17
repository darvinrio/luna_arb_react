import { Component } from "react"
import styled from "styled-components"

import { undelegations, RedeemOut } from "./scripts/Undelegations"
import { Button } from "./styles/Button.style"

import tokenJson from "./../json/token.json"

interface State {
    "div": any | null,
}

interface Props {
    user: string | null
}


export class PendingDelegations extends Component<Props, { data: State, DataisLoaded: boolean }> {
    constructor(props: Props = { "user": null }) {
        super(props)

        this.state = {
            data: {
                div: null
            },
            DataisLoaded: false,
        }
    }

    makeDiv(data: RedeemOut[]) {

        data.sort(
            (a, b) => {
                if ((a.releaseTime.getTime() == 0) || (b.releaseTime.getTime() == 0)) {
                    return b.releaseTime.getTime() - a.releaseTime.getTime()
                }
                return a.releaseTime.getTime() - b.releaseTime.getTime();
            }
        )

        const today = (new Date()).getTime()

        return data.map(undelegation => {

            let disabled: boolean = true
            if (undelegation.releaseTime.getTime() == 0) {
                disabled = false
            } else if (undelegation.releaseTime.getTime() > today) {
                disabled = false
            }

            let link:string = tokenJson.filter(token => token.id===undelegation.token)[0].collect_link

            return (
                <Tr key={Math.random()}>
                    <Col>
                        {undelegation.token}
                    </Col>
                    <Col>
                        {undelegation.redeemLuna.toFixed(6)}
                    </Col>
                    <Col>
                        <p
                            style={{ "padding": 0 }}
                        >
                            {!disabled ? 'Est. release on' : 'its'}
                        </p>
                        {(undelegation.releaseTime.getTime() == 0)
                            ? 'pending'
                            : (
                                !disabled ? (undelegation.releaseTime.toDateString()) : 'Available now'
                            )}
                    </Col>
                    <Col>
                        {!disabled
                            ? (
                                <Button
                                    bg={"grey"}
                                    disabled
                                >
                                    Claim
                                </Button>
                            )
                            : (
                                <Button
                                    bg={"white"}
                                    onClick={()=> window.open(link, "_blank")}
                                >
                                    Claim
                                </Button>
                            )
                        }
                    </Col>
                </Tr>
            )
        })
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.user !== this.props.user) {
            this.componentDidMount()
        }
    }

    componentDidMount() {
        undelegations(this.props.user)
            .then(value => {
                console.log(value)
                let divData = this.makeDiv(value)
                this.setState({
                    data: {
                        div: divData
                    },
                    DataisLoaded: true
                })
            })
            .catch(err => {
                console.log(this.props.user)
                console.log(err)
            })
    }

    render() {
        const { DataisLoaded, data }: any = this.state;

        if (!DataisLoaded) {
            return (
                <div>
                    <h1> Please wait some time.... </h1>
                </div>
            )
        } else {
            return (
                <Table>
                    {this.state.data.div}
                </Table>
            )
        }
    }
}

const Table = styled.table`
    width: 100%;
`

const Tr = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr 3fr 2fr;

    border: 1px solid;
    border-radius: 50px;
    margin: 30px;
    padding: 30px;

    @media (max-width: 768px){
        grid-template-columns: 1fr;
        padding-bottom: 0
    }
`

const Col = styled.div`
    margin: auto;
    @media (max-width: 768px) {
        display: grid;
        /* grid-template: 1fr 1fr 1fr / 1fr; */
        margin: 0;
        padding: 10px;
    }
    /* display: flex;
    justify-content: center;
    align-items: center; */
`