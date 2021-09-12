export type StateType = {
  greeting: string
  inputValue: string
  isLoading: boolean
}
export type ActionType =
  | {
      type: 'SET_GREETING'
      greeting: StateType['greeting']
    }
  | {
      type: 'SET_INPUT_VALUE'
      inputValue: StateType['inputValue']
    }
  | {
      type: 'SET_LOADING'
      isLoading: StateType['isLoading']
    }

export type ProtectionActionType =
  | {
      type: 'SET_COL'
      col: AssetType['col']
    }
  | {
      type: 'SET_BOR'
      bor: AssetType['bor']
    }

export const initialState: StateType = {
  greeting: '',
  inputValue: '',
  isLoading: false,
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
export function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    // Track the greeting from the blockchain
    case 'SET_GREETING':
      return {
        ...state,
        greeting: action.greeting,
      }
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.inputValue,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      }
    default:
      throw new Error()
  }
}
