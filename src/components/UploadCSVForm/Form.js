import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, change, touch, untouch } from 'redux-form'
import { 
    get as _get,
    map as _map,
    isArray as _isArray
} from 'lodash'
import { Button } from '@material-ui/core'

// import CSVReader from './../CSVReader/CSVReader'
import CSVReader from './../CSVReader/FormField'
import { uploadCSV } from './../../state/CSVUploader/action'
export const csvUploadForm = "csvUploadForm"



const Form = ({handleSubmit, change, touch, untouch, submitting, submitSucceeded, ...restProps}) => {
    const handleOnDrop = (dataList) => {
        const mappedDataForDB = _map(
            dataList,
            obj => ({
                firstName: _get(obj, 'data[0]', ''),
                lastName: _get(obj, 'data[1]', ''),
                contactNumber: _get(obj, 'data[2]', ''),
                timeZone: _get(obj, 'data[3]', '')
            }) 
        )
        touch('dataList')
        change('dataList', mappedDataForDB)
      };
    
    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
      };
    
    const handleOnRemoveFile = (dataList) => {
        untouch('dataList')
        change('dataList', null)
    };
    
    

    
    return (
        <form onSubmit={handleSubmit}>
            <Field 
                name="dataList"
                component={CSVReader}
                handleOnDrop={handleOnDrop}
                handleOnRemoveFile={handleOnRemoveFile}
                handleOnError={handleOnError}
            />

           
            <Button type="submit" variant="outlined" color="primary"
                disabled={submitting || submitSucceeded}
            >Upload</Button>
        </form>
    )
}

const mapStateToProps = state => {
    return {
        
    }
}

const mapDispatchToProps = dispatch => {
    return {
        change: (field, value) => dispatch(change(csvUploadForm, field, value)),
        touch: (...fields) => dispatch(touch(csvUploadForm, ...fields)),
        untouch: (...fields) => dispatch(untouch(csvUploadForm, ...fields)),
        uploadCSV: (dataList) => dispatch(uploadCSV(dataList))
    }
}

const validate = (values, props) => {
    const syncErrors = {}
    if(!values.dataList) {
        syncErrors.dataList = "Required"
    } else if(!_isArray(values.dataList)) {
        syncErrors.dataList = "Bad data"
    } else if(_get(values.dataList, 'length') < 1) {
        syncErrors.dataList = "Empty data"
    }
    return syncErrors
}

const onSubmit = (values, dispatch, props) => {
    console.log(values)
    return props.uploadCSV(values.dataList)
}

const onSubmitSuccess = (result, dispatch, props) => {
    props.history.push('/')
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    reduxForm({
        form: csvUploadForm,
        initialValues: {
            dataList: null
        },
        validate,
        onSubmit,
        onSubmitSuccess,
        destroyOnUnmount: true,
    })(Form)
)
