import type { BigNumber } from "ethers"
import { ReserveData } from "./ReserveData"

export type ProtectionData = {
  protectionId: string
  thresholdHealthFactor: BigNumber
  wantedHealthFactor: BigNumber
  colToken: string
  debtToken: string
}

export type ProtectionAssetData = {
  col: ReserveData
  debt: ReserveData
  protectionId: string
  thresholdHealthFactor: BigNumber
  wantedHealthFactor: BigNumber
  colToken: string
  debtToken: string
}
