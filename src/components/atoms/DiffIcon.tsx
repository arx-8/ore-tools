/** @jsx jsx */
import { InterpolationWithTheme, jsx } from "@emotion/core"
import React from "react"
import diffIcon from "src/assets/diffIcon.jpg"
import { CastAny } from "src/types/utils"

type OwnProps = {
  children?: never
  exCss?: InterpolationWithTheme<CastAny>
}

export const DiffIcon: React.FC<OwnProps> = ({ exCss }) => {
  return <img css={exCss} src={diffIcon} alt="diffIcon" />
}
