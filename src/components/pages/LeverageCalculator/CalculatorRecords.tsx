/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { FormControlLabel, Paper, Radio } from "@material-ui/core"
import { grey, red } from "@material-ui/core/colors"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableContainer from "@material-ui/core/TableContainer"
import DeleteIcon from "@material-ui/icons/Delete"
import React, { Fragment } from "react"
import { FastTextField } from "src/components/atoms/FastTextField"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"
import { PriceOrLoss } from "src/components/atoms/ProfitOrLoss"
import { useLeverageCalculator } from "src/components/helpers/LeverageCalculatorContext"
import { LabeledRow } from "src/components/molecules/LabeledRow"
import { LabeledRowWithRadios } from "src/components/molecules/LabeledRowWithRadios"
import { ComparePricesTable } from "src/components/pages/LeverageCalculator/ComparePricesTable"
import { OrdersTable } from "src/components/pages/LeverageCalculator/OrdersTable"
import { padT, tar } from "src/components/styles/styles"
import { currenciesLabeled } from "src/domainLayer/investment/Currency"
import { lsValuesLabeled } from "src/domainLayer/investment/LS"
import {
  calcLeverage,
  calcOrderPrice,
  getMoneyValueAsJpy,
  multiplyMoney,
  setMoneyCurrency,
} from "src/domainLayer/investment/Money"
import { Order, getHeadOrderStrict } from "src/domainLayer/investment/Order"

type Props = {
  children?: never
}

export const CalculatorRecords: React.FC<Props> = () => {
  const {
    accountBalance,
    records,
    setRecordById,
    usdJpy,
    removeRecordById,
  } = useLeverageCalculator()

  const calcTotalOrderPriceAsJpy = (orders: Order[]): number => {
    return orders.reduce((acc, curr) => {
      return (acc += getMoneyValueAsJpy(
        calcOrderPrice(curr.targetUnitPrice, curr.orderQuantity),
        usdJpy
      ))
    }, 0)
  }

  const calcTotalLeverage = (orders: Order[]): number => {
    return orders.reduce((acc, curr) => {
      return (acc += calcLeverage(
        accountBalance,
        multiplyMoney(curr.targetUnitPrice, curr.orderQuantity),
        usdJpy
      ))
    }, 0)
  }

  return (
    <Fragment>
      {records.map(({ _id, isLong, name, orders }, index) => {
        const setRecord = setRecordById(_id)
        const order1st = getHeadOrderStrict(orders)

        return (
          <Fragment key={_id}>
            <div css={index > 0 && padT} />

            <TableContainer
              component={Paper}
              css={(index + 1) % 2 === 0 && evenRecord}
            >
              <div css={actions}>
                <span css={rowNum}>{index + 1}</span>
                <IconButtonGA
                  aria-label="remove"
                  css={deleteBtn}
                  disabled={records.length <= 1}
                  gaData={{
                    dataEventAction: "remove record",
                    dataEventCategory: "LeverageCalculator",
                    dataOn: "click",
                  }}
                  onClick={() => {
                    if (window.confirm("Delete ?")) {
                      removeRecordById(_id)
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButtonGA>
              </div>

              <Table css={tableCss} size="small">
                <TableBody>
                  <LabeledRow label="名前">
                    <FastTextField
                      onChangeValue={(v) => {
                        setRecord((draft) => {
                          draft.name = v
                        })
                      }}
                      value={name}
                    />
                  </LabeledRow>
                  <LabeledRowWithRadios
                    checked={order1st.targetUnitPrice.currency}
                    label="発注"
                    onCheckRadio={(v) => {
                      // 1 record は同じ currency しか入力できない
                      setRecord((draft) => {
                        draft.orders.forEach((o) => {
                          o.targetUnitPrice = setMoneyCurrency(
                            o.targetUnitPrice,
                            v
                          )
                        })
                      })
                    }}
                    radioValues={currenciesLabeled}
                  >
                    <OrdersTable recordIndex={index} />
                  </LabeledRowWithRadios>
                  <LabeledRow label="売買">
                    <div css={radios}>
                      {lsValuesLabeled.map((v) => {
                        return (
                          <FormControlLabel
                            checked={isLong ? v.value === "L" : v.value === "S"}
                            control={<Radio color="primary" />}
                            key={v.value}
                            label={v.label}
                            onClick={() => {
                              setRecord((draft) => {
                                draft.isLong = v.value === "L"
                              })
                            }}
                          />
                        )
                      })}
                    </div>
                  </LabeledRow>
                  <LabeledRow label="発注価格 (JPY)">
                    <div css={[calcCell, tar]}>
                      <PriceOrLoss
                        value={calcTotalOrderPriceAsJpy(
                          orders.filter((o) => o.selected)
                        )}
                      />
                    </div>
                  </LabeledRow>
                  <LabeledRow label="レバレッジ">
                    <div css={[calcCell, tar]}>
                      <PriceOrLoss
                        value={calcTotalLeverage(
                          orders.filter((o) => o.selected)
                        )}
                      />
                    </div>
                  </LabeledRow>
                </TableBody>
              </Table>

              {/* 上の table の cell と同じ幅だとレイアウトの都合が悪いため、分ける */}
              <ComparePricesTable recordIndex={index} />
            </TableContainer>
          </Fragment>
        )
      })}
    </Fragment>
  )
}

const evenRecord = css`
  background: lavender;
`

const tableCss = css`
  & td {
    border-bottom: 1px solid rgba(160, 160, 160, 1);
  }
`

const rowNum = css`
  padding: 8px;
`

const actions = css`
  display: flex;
  justify-content: space-between;
`

const deleteBtn = css`
  color: ${red["400"]};
`

const radios = css`
  display: flex;
`

const calcCell = css`
  background-color: ${grey.A100}!important;
  width: 196px;
`
