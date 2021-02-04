import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import {
    get as _get,
    map as _map,
    includes as _includes,
    filter as _filter,
} from 'lodash'
import { jsonToCSV } from 'react-papaparse'
import { Box, Checkbox, IconButton, Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Delete as DeleteIcon} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { fetchData, handleSelectedRowsId, deleteSelected } from './../../state/MainList/action'

const useStyles = makeStyles({
    table: {
        borderRadius: '5px',
        overflow: 'hidden',
        padding: '15px'
    },
    copyToClipBoard: {
        display: 'flex',
        alignItems: 'center',
        height: 48
    }
})

const List = ({fetchData, data, loadingData, selectedRowsId, handleSelectedRowsId, deleteSelected, ...restProps}) => {
    const [ shouldShowSuccessAlert, showSuccessAlert ] = useState(false)
    const classes = useStyles()
    useEffect(() => {
        fetchData()
        // eslint-disable-next-line
    }, [])

    const filterMethod = (filter, row, column) => {
        console.log(filter, row, column)
        const id = _get(filter, 'id')
        console.log(id)
        const search = _get(filter, 'value')
        console.log(search)
        const str = _get(row, `[${id}]` )
        console.log(str)
        const regex = new RegExp(search, 'i') 
        const condition = regex.test(str)
        console.log(condition, '\n\n\n')
        return condition
    }

    const handleCheckboxClick = (event, _idStr) => {
        console.log(event)
        const checked = _get(event, 'target.checked')
        
        const newArr = !checked ? _filter(
            selectedRowsId,
            _id => _id !== _idStr
        ) : [...selectedRowsId, _idStr]
        console.log(checked, selectedRowsId, newArr, _idStr)
        handleSelectedRowsId(newArr)
    }

    const isChecked = (_idStr) => {

        return _includes(selectedRowsId, _idStr)
    }

    const CheckBoxCell = row => {
        // console.log(row)
        const _idStr = _get(row, 'original._id')
        return <Checkbox 
            checked={isChecked(_idStr)}
            onChange={e => handleCheckboxClick(e, _idStr)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
        />
    }

    const handleDeleteClick = () => {
        deleteSelected(selectedRowsId)
    }

    const DeleteHeader = () => (
        <IconButton aria-label="delete" onClick={() => handleDeleteClick()}>
          <DeleteIcon />
        </IconButton>
    )

    const exportData = data => {
        console.log(data)
        const jsonData = _map(
            data,
            ({firstName, lastName, contactNumber, timeZone}) => ({firstName, lastName, contactNumber, timeZone})
        )
        console.log(jsonData)
        const csv = jsonToCSV(jsonData)
        console.log(csv)
        navigator.clipboard.writeText(csv)
        showSuccessAlert(true)
    }

    const columns = [
        {
            id: "delete",
            Header: DeleteHeader,
            Cell: CheckBoxCell,
            width: 60,
            sortable: false,
            filterable: false,
        },
        {
            Header: "First Name",
            accessor: "firstName",
            filterMethod: filterMethod
        },
        {
            Header: "Last Name",
            accessor: "lastName",
            filterMethod: filterMethod
        },
        {
            Header: "Contact Number",
            accessor: "contactNumber",
            sortable: false,
            filterMethod: filterMethod
        },
        {
            Header: "Time zone",
            accessor: "timeZone",
            filterMethod: filterMethod
        },
    ]

    return (
        <ReactTable 
            columns={columns}
            data={data}
            filterable
            loading={loadingData}
            defaultPageSize={10}
            className="-striped -highlight"
        >
            {(state, makeTable, instance) => {
                console.log(state.sortedData)
                return (
                <Box
                    className={classes.table}
                >
                    <Box className={classes.copyToClipBoard}>
                        <Button variant="outlined" color="primary" 
                            // onClick={() => console.log("clicked")}
                            onClick={() => exportData(state.sortedData)}
                        >
                            Copy to clipboard
                        </Button>
                        {shouldShowSuccessAlert && <Alert onClose={() => showSuccessAlert(false)}>Copied csv to clipboard</Alert>}
                    </Box>

                    {makeTable()}
                </Box>
                )
            }}
        </ReactTable>
    )
}

const mapStateToProps = state => {
    return {
        data: _get(state, 'MainListReducer.data'),
        loadingData: _get(state, 'MainListReducer.loadingData'),
        selectedRowsId: _get(state, 'MainListReducer.selectedRowsId')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchData: query => dispatch(fetchData(query)),
        handleSelectedRowsId: arr => dispatch(handleSelectedRowsId(arr)),
        deleteSelected: arr => dispatch(deleteSelected(arr))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List)

