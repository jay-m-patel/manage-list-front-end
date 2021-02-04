import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, change, touch, untouch } from 'redux-form'
import ReactTable from 'react-table-v6'
import { 
    get as _get,
    map as _map,
    isArray as _isArray,
    includes as _includes,
    toNumber as _toNumber,
    find as _find,
    keys as _keys,
    values as _values,
} from 'lodash'
import { Button, Box, Select, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'


import CSVReader from './../CSVReader/FormField'
import { uploadCSV } from './../../state/CSVUploader/action'
export const csvUploadForm = "csvUploadForm"

const useStyles = makeStyles({
    table: {
        borderRadius: '5px',
        overflow: 'auto',
        padding: '15px'
    },
    select: {
        width: '100%'
    }
})

const getKeyByValue = (object, value) => {
    console.log(object, value)
    const key = _find(_keys(object), (key => object[key] === value));
    console.log(key)
    return key
  }

const Form = ({rawDataList, selectedFieldIndex, handleSubmit, change, touch, untouch, submitting, submitSucceeded, ...restProps}) => {
    const classes = useStyles()

    const handleOnDrop = (rawDataList) => {

        touch('rawDataList')
        change('rawDataList', rawDataList)
    };
    
    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };
    
    const handleOnRemoveFile = (rawDataList) => {
        untouch('rawDataList')
        change('rawDataList', null)
    };
    
    const firstDataForSelectorTable = {..._get(rawDataList, '[0].data')}

    const isSelected = (field) => {
       return _includes(_values(selectedFieldIndex), field)
    }

    const fieldSelector = (index) =>
    <Select
        className={classes.select}
        onChange={(event) => {
            const field = event.target.value
            console.log(field, index)
            
            change('selectedFieldIndex', {...selectedFieldIndex, [_toNumber(index)]: field})
            
        }}
        value={_get(selectedFieldIndex, `[${index}]`, '')}
    >
        <MenuItem value=""><em>None</em></MenuItem>
        <MenuItem value="firstName" disabled={isSelected("firstName")}>First Name</MenuItem>
        <MenuItem value="lastName" disabled={isSelected("lastName")}>Last Name</MenuItem>
        <MenuItem value="contactNumber" disabled={isSelected("contactNumber")}>Contact Number</MenuItem>
        <MenuItem value="timeZone" disabled={isSelected("timeZone")}>Timezone</MenuItem>
    </Select>

    const getColumns = () => {
        const columns = _map(
            firstDataForSelectorTable,
            (data, index) => {
                return {
                    id: index,
                    // Header: index,
                    accessor: index,
                    filterable: false,
                    sortable: false,
                    Header: fieldSelector(index),
                    minWidth: 200
                }
            }
        )
        console.log(columns)
        return columns
    }

    
    return (
        <form onSubmit={handleSubmit}>
            {!rawDataList && <h5>Sequence can be managed after uploading.</h5>}

            <Field 
                name="rawDataList"
                component={CSVReader}
                handleOnDrop={handleOnDrop}
                handleOnRemoveFile={handleOnRemoveFile}
                handleOnError={handleOnError}
            />

            {rawDataList && <ReactTable
                data={[firstDataForSelectorTable]}
                columns={getColumns()}
                defaultPageSize={1}
                pageSizeOptions={[1]}
                showPagination={false}
            >
                {(state, makeTable, instance) => {
                    
                    return (
                    <Box
                        className={classes.table}
                    >
                        <h3>Please, select proper fields.</h3>
                        {makeTable()}
                    </Box>
                    )
                }}
            </ReactTable>}

            {rawDataList && <Button 
                type="submit" 
                variant="outlined" color="primary"
                disabled={submitting || submitSucceeded}
            >Save to Database</Button>}
        </form>
    )
}

const mapStateToProps = state => {
    return {
        rawDataList: _get(state, 'form.csvUploadForm.values.rawDataList'),
        selectedFieldIndex: _get(state, 'form.csvUploadForm.values.selectedFieldIndex')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        change: (field, value) => dispatch(change(csvUploadForm, field, value)),
        touch: (...fields) => dispatch(touch(csvUploadForm, ...fields)),
        untouch: (...fields) => dispatch(untouch(csvUploadForm, ...fields)),
        uploadCSV: (rawDataList) => dispatch(uploadCSV(rawDataList))
    }
}

const validate = (values, props) => {
    const syncErrors = {}
    if(!values.rawDataList) {
        syncErrors.rawDataList = "Required"
    } else if(!_isArray(values.rawDataList)) {
        syncErrors.rawDataList = "Bad data"
    } else if(_get(values.rawDataList, 'length') < 1) {
        syncErrors.rawDataList = "Empty data"
    }
    return syncErrors
}

const onSubmit = (values, dispatch, props) => {
    console.log(values)

    const rawDataList = _get(props, 'rawDataList')
    const selectedFieldIndex = _get(props, 'selectedFieldIndex')

    console.log(rawDataList)

    const mappedDataForDB = _map(
        rawDataList,
        obj => ({
            firstName: _get(obj, `data[${getKeyByValue(selectedFieldIndex, "firstName")}]`, ''),
            lastName: _get(obj, `data[${getKeyByValue(selectedFieldIndex, "lastName")}]`, ''),
            contactNumber: _get(obj, `data[${getKeyByValue(selectedFieldIndex, "contactNumber")}]`, ''),
            timeZone: _get(obj, `data[${getKeyByValue(selectedFieldIndex, "timeZone")}]`, '')
        }) 
    )
    console.log(mappedDataForDB)
    return props.uploadCSV(mappedDataForDB)
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
            rawDataList: null,
            selectedFieldIndex: {

            }
        },
        validate,
        onSubmit,
        onSubmitSuccess,
        destroyOnUnmount: true,
    })(Form)
)
