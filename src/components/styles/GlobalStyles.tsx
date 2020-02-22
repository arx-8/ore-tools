import { Global, css } from "@emotion/core"
import { ThemeProvider, createMuiTheme } from "@material-ui/core"
import emotionNormalize from "emotion-normalize"
import React, { ReactNode } from "react"

type OwnProps = {
  children: ReactNode
}

export const GlobalStyles: React.FC<OwnProps> = ({ children }) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <Global styles={globalStyles} />
      {children}
    </ThemeProvider>
  )
}

/**
 * for emotion
 */
const globalStyles = css`
  ${emotionNormalize}

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`

/**
 * for material-ui
 */

const muiTheme = createMuiTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
})
