import { CSV_UPLOADED } from './../action-types'

const initialState = {}
const reducer = (state = initialState, action) => {
    const { type, payload } = action
    switch(type) {
        case CSV_UPLOADED:
            return {
                csvUploaded: payload,
                ...state
            }
        default:
            return state
    }
}

export default reducer