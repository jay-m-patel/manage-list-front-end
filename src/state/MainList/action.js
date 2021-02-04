import axios from "axios"
import { DATA_LIST, LOADING_DATA_LIST, SELECTED_ROWS } from "./../action-types"
import { serverURL } from './../serverURL'

export const data = (data) => {
    return {
        type: DATA_LIST,
        payload: data
    }
}

export const loadingData = (bool) => {
    return {
        type: LOADING_DATA_LIST,
        payload: bool
    }
}

export const fetchData = () => async dispatch => {
    try {
        dispatch(loadingData(true))
        const response = await axios.get(`${serverURL}/data-list`)
        console.log(response)
        if(response) {
            dispatch(loadingData(false))
        }
        return dispatch(data(response.data))
        
    } catch(err) {
        console.log(err)
    }
}

export const handleSelectedRowsId = arr => {
    return {
        type: SELECTED_ROWS,
        payload: arr
    }
}

export const deleteSelected = selectedRowsId => async dispatch => {
    try {
        dispatch(loadingData(true))

        const config = {
            params: {
                selectedRowsIdStr: selectedRowsId
            }
        }

        const response = await axios.delete(`${serverURL}/delete-selected`, config)

        if(response) {
            console.log(response)
            dispatch(fetchData())
        }

        dispatch(handleSelectedRowsId([]))
    } catch(err) {
        console.log(err)
    }
}