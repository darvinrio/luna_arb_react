import { createGlobalStyle } from "styled-components";


export const GlobalStyles = createGlobalStyle`
  
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono&display=swap');
  
  * {
    box-sizing: border-box;
  }
  body {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text} ;
    font-family: ${({ theme }) => theme.font_family.name}, ${({ theme }) => theme.font_family.type};
    font-size: 1.15em;
    margin: 0;
    padding: 0;
  }
  p {
    opacity: 0.8;
    line-height: 1.5;
    font-size: 1.1rem;
    h1{
    font-size: 3rem
  }
  }
  img {
    max-width: 100%;
}
`

// export default GlobalStyles