/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react"
import React from "react"
import { Link } from "react-router-dom"
import { Layout } from "src/components/templates/Layout"
import { StaticRoutePath } from "src/constants/path"

type OwnProps = {
  children?: never
}

export const NotFound: React.FC<OwnProps> = () => {
  return (
    <Layout>
      <div css={root}>
        <div css={header}>
          <p>Page not found.</p>
          <Link css={link} to={StaticRoutePath.root}>
            Go to Top
          </Link>
        </div>
      </div>
    </Layout>
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

const link = css`
  color: #61dafb;
`
