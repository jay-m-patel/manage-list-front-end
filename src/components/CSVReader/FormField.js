import React from 'react'
import InputCSV from './CSVReader'
import { Alert } from '@material-ui/lab'

const RenderCSVReader = ({input, meta, ...restProps}) => {
    return (
      <>
        <InputCSV
          {...restProps}
        >
        </InputCSV>
        {meta.touched && meta.error &&
          <Alert severity="error">{meta.error}</Alert>
        }
      </>
    );
}
export default RenderCSVReader