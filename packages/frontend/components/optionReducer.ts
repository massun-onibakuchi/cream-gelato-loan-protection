export type ProtectionActionType =
  | {
      type: 'SET_COL'
      col: AssetType['col']
    }
  | {
      type: 'SET_BOR'
      bor: AssetType['bor']
    }

export type AssetType = {
  col: string
  bor: string
}
export const initialOptions: AssetType = {
  col: '',
  bor: '',
}
export const optionReducer = (state: AssetType, action: ProtectionActionType) => {
  switch (action.type) {
    case 'SET_COL':
      if (state.bor === action.col) return state
      return {
        ...state,
        col: action.col,
      }
    case 'SET_BOR':
      if (state.col === action.bor) return state
      return {
        ...state,
        bor: action.bor,
      }
    default:
      throw new Error()
  }
}
