import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
//
import {
  useConnectedWallet,
} from '@terra-money/wallet-provider';
//

// import { NoHop } from './components/NoHop';
import { Swaps } from './components/Swaps';
import { WalletConnect } from './components/WalletConnect';
import { PendingDelegations } from './components/PendingDelegations';

import theme from './json/theme/darkTheme.json'
import terraTheme from './json/theme/terraTheme.json'

import { DefaultTheme } from 'styled-components';
import { GlobalStyles } from './components/styles/Global.style';
import { Container } from './components/styles/Container.style';
import { Button } from './components/styles/Button.style'

// const myTheme: DefaultTheme = theme
const myTheme: DefaultTheme = terraTheme


function App() {

  const [wallet, setWallet] = useState<string | null>(null)

  const [arb, activateArb] = useState<boolean>(true)
  const [claim, activateClaim] = useState<boolean>(false)

  return (
    <ThemeProvider theme={myTheme}>
      <GlobalStyles />
      <Container>
        <TopNav>
          <NavLogo>
            <p>
              <h1>
                Happy {arb && 'Arbing'}{claim && 'Claiming'}
              </h1>
              - a mayo build
              <Warn>
                (use at your own risk, please test with small amount first)
              </Warn>
            </p>
            <Button
              bg={"transparent"}
              color={"white"}
              onClick={() => {
                console.log('hi')
                activateArb(!arb)
                activateClaim(!claim)
              }}
            >
              <h4>({!arb && 'make arbs'}{!claim && 'track claims'})</h4>
            </Button>
          </NavLogo>
          <div>
            <WalletConnect setWallet={setWallet} />
          </div>
        </TopNav>
        <br />
        <body>
          {
            arb &&
            <Swaps simAmt={0} walletAddr={wallet!} />
          }
          {
            claim &&
            <PendingDelegations user={wallet!} />
          }
        </body>
      </Container>
    </ThemeProvider>
  );
}

export default App;

const TopNav = styled.nav`
  /* display: grid; */
  /* grid-template-columns: 3fr 2fr; */
  display: flex;
  flex-direction: row;

  align-items:baseline;
  justify-content:space-between;

  @media (max-width: 700px){
    display: flex;
    flex-direction: column;
    align-items:flex-start;
    justify-content: left;
  }
`

const NavLogo = styled.div`
  display: flex;
  flex-direction: row;

  align-items:baseline
`

const Warn = styled.h5`
  color: yellow
`

