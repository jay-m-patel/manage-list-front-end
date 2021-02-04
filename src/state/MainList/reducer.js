import { DATA_LIST, LOADING_DATA_LIST, SELECTED_ROWS } from './../action-types'

const initialState = {
    selectedRowsId: []
}
const reducer = (state = initialState, action) => {
    const { type, payload } = action
    console.log(type, payload)
    switch(type) {
        case DATA_LIST:
            return {
                ...state,
                data: [...payload.dataList],
            }
        case LOADING_DATA_LIST:
            return {
                ...state,
                loadingData: payload,
            }
        case SELECTED_ROWS:
            return {
                ...state,
                selectedRowsId: payload,
            }
        default:
            return state
    }
}

export default reducer