/** @jsx jsx */
import React from "react"
import logo from "../../assets/logo.svg"
import { css, jsx } from "@emotion/core"

const App: React.FC = () => {
  return (
    <div css={root}>
      <header css={header}>
        <img src={logo} css={logoCss} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          css={link}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

const root = css`
  text-align: center;
`

const header = css`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`

const logoCss = css`
  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  animation: App-logo-spin infinite 20s linear;
  height: 40vmin;
  pointer-events: none;
`

const link = css`
  color: #61dafb;
`

export default App