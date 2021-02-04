import React from 'react'
import { CSVReader as InputCSV } from 'react-papaparse'
const CSVReader = ({handleOnDrop, handleOnRemoveFile, handleOnError, accept, ...restProps}) => {
    return (
      <>
        <h5>Sequence: first name, last name, contact number, time zone</h5>
        <InputCSV
          onDrop={handleOnDrop}
          onError={handleOnError}
          addRemoveButton
          onRemoveFile={handleOnRemoveFile}
          accept={accept || '.csv'}
        >
          <span>Drop CSV file here or click to upload.</span>
        </InputCSV>
      </>
    );
}
export default CSVReader