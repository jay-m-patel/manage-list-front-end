import axios from 'axios'
import { CSV_UPLOADED } from './../action-types'
import { serverURL } from './../serverURL'

export const csvUploaded = (payload) => {
    return {
        type: CSV_UPLOADED,
        payload
    }
}

export const uploadCSV = (payload) => async (dispatch) => {
    try {
        console.log(payload)
        const response = await axios.post(`${serverURL}/upload-csv`, payload)
    
        return dispatch(csvUploaded(response.data))
    
    } catch(err) {
        console.log(err)
    }
}