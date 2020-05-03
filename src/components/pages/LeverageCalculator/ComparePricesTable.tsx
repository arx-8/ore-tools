/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { TableSortLabel } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import ClearIcon from "@material-ui/icons/Clear"
import React from "react"
import { ButtonGA } from "src/components/atoms/ButtonGA"
import { FastNumberField } from "src/components/atoms/FastNumberField"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"
import { PriceOrLoss, ProfitOrLoss } from "src/components/atoms/ProfitOrLoss"
import { useLeverageCalculator } from "src/components/helpers/LeverageCalculatorContext"
import { tar } from "src/components/styles/styles"
import {
  calcProfitOrLossAsJpy,
  getMoneyValue,
  roundMoney,
} from "src/domainLayer/investment/Money"
import {
  calcAveragePrice,
  getHeadOrderStrict,
} from "src/domainLayer/investment/Order"
import { sortBy } from "src/utils/arrayUtils"
import { calc10PerStep } from "src/utils/numberUtils"

type Props = {
  children?: never
  /** TODO ここ _id にして index を廃止すべき */
  recordIndex: number
}

export const ComparePricesTable: React.FC<Props> = ({ recordIndex }) => {
  const {
    accountBalance,
    records,
    setRecordById,
    usdJpy,
  } = useLeverageCalculator()

  const { _id, comparePrices, comparePricesSortBy, isLong, orders } = records[
    recordIndex
  ]

  const order1st = getHeadOrderStrict(orders)

  const toggleComparePricesSortBy = (): void => {
    setRecordById(_id, (draft) => {
      if (draft.comparePricesSortBy == null) {
        draft.comparePricesSortBy = {
          direction: "asc",
          target: "targetUnitPrice",
        }
        draft.comparePrices = sortBy(draft.comparePrices, "asc")
      } else {
        const nextDir =
          draft.comparePricesSortBy.direction === "asc" ? "desc" : "asc"
        draft.comparePricesSortBy = {
          direction: nextDir,
          target: draft.comparePricesSortBy.target,
        }
        draft.comparePrices = sortBy(draft.comparePrices, nextDir)
      }
    })
  }

  const calcTotalProfitOrLossAsJpy = (comparePrice: number): number => {
    return orders.reduce((acc, curr) => {
      return (acc += getMoneyValue(
        calcProfitOrLossAsJpy(
          comparePrice,
          curr.targetUnitPrice,
          curr.orderQuantity,
          isLong,
          usdJpy
        )
      ))
    }, 0)
  }

  const calcAccountBalanceWithTotalProfitOrLossAsJpy = (
    comparePrice: number
  ): number => {
    return orders.reduce((acc, curr) => {
      return (acc += getMoneyValue(
        calcProfitOrLossAsJpy(
          comparePrice,
          curr.targetUnitPrice,
          curr.orderQuantity,
          isLong,
          usdJpy
        )
      ))
    }, accountBalance.asJpy)
  }

  return (
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell css={parentCol1}>価格比較</TableCell>
          <TableCell>
            <ButtonGA
              gaData={{
                dataEventAction: "add compare price",
                dataEventCategory: "LeverageCalculator",
                dataOn: "click",
              }}
              onClick={() =>
                setRecordById(_id, (draft) => {
                  // デフォルト値は、入力値の基準になるよう +-0 値（の近似値）にする
                  draft.comparePrices.push(
                    getMoneyValue(roundMoney(calcAveragePrice(orders)))
                  )
                })
              }
              size="small"
              variant="contained"
            >
              追加
            </ButtonGA>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell css={col1}>
                    <TableSortLabel
                      active={comparePricesSortBy?.target === "targetUnitPrice"}
                      direction={comparePricesSortBy?.direction}
                      onClick={toggleComparePricesSortBy}
                    >
                      対象単価 ({order1st.targetUnitPrice.currency})
                    </TableSortLabel>
                  </TableCell>
                  <TableCell css={col2}>損益 (JPY)</TableCell>
                  <TableCell css={col3}>証拠金残高 (JPY)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparePrices.map((p, index) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <TableRow key={index}>
                      {/* 対象単価 */}
                      <TableCell css={tar}>
                        <FastNumberField
                          arrowInputStep={calc10PerStep(p)}
                          onChangeValue={(v) => {
                            setRecordById(_id, (draft) => {
                              draft.comparePrices[index] = v ?? 0
                            })
                          }}
                          value={p}
                        />
                      </TableCell>

                      {/* 損益 */}
                      <TableCell css={tar}>
                        <ProfitOrLoss value={calcTotalProfitOrLossAsJpy(p)} />
                      </TableCell>

                      {/* 証拠金残高 */}
                      <TableCell css={tar}>
                        <PriceOrLoss
                          value={calcAccountBalanceWithTotalProfitOrLossAsJpy(
                            p
                          )}
                        />
                      </TableCell>

                      {/* 操作 */}
                      <TableCell>
                        <IconButtonGA
                          gaData={{
                            dataEventAction: "delete compare price",
                            dataEventCategory: "LeverageCalculator",
                            dataOn: "click",
                          }}
                          onClick={() => {
                            setRecordById(_id, (draft) => {
                              draft.comparePrices = draft.comparePrices.filter(
                                (_, draftIdx) => draftIdx !== index
                              )
                            })
                          }}
                        >
                          <ClearIcon />
                        </IconButtonGA>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

const parentCol1 = css`
  width: 88px;
`

const col1 = css`
  width: 144px;
`

const col2 = css`
  width: 112px;
`

const col3 = css`
  width: 112px;
`
