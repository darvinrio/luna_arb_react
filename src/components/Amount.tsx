import styled from "styled-components"
import { useTheme } from "styled-components"
import { useState } from "react"

import { Button } from "./styles/Button.style"
interface props {
    simAmt: number,
    setSimAmt: any
}


export const Amount = ({ simAmt, setSimAmt }: props) => {

    const [amount, setAmount] = useState(simAmt)

    const theme = useTheme();

    const handleSubmit = (e: any) => {
        e.preventDefault();

        setSimAmt(amount)
        // console.log(amount);
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}
            >
                <AmountGrid>
                    <StyledLabel>Amount of Luna</StyledLabel>
                    <StyledInput
                        type="number"
                        step=".000001"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        required
                    />
                    <Button
                        bg={theme.colors.btn_light}
                        onClick={handleSubmit}
                    > Simulate </Button>
                </AmountGrid>
            </form>
        </div>
    )
}

const AmountGrid = styled.div`
    display:grid;
    grid-template-columns: 1fr 2fr 1fr;
    align-items:center;
    /* align-self: center; */
    /* justify-self:center; */

    @media (max-width: 768px){
    grid-template-columns: 1fr
  }
`

const StyledInput = styled.input`
    border-radius: 50px;
    font-family: ${({ theme }) => theme.font_family.name}, ${({ theme }) => theme.font_family.type};
    min-height: 50px;
    min-width: auto;
    /* width: 100%; */
    padding: 10px 10px;
    margin: 10px 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    display: flexbox;
    justify-content: space-between;
`

const StyledLabel = styled.label`
    text-align: center;
    display: block;
    font-size:2rem;
`