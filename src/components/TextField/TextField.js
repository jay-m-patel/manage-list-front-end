import React from 'react'
import { TextField as TextFieldMui } from '@material-ui/core'

const TextField = ({type, label, ...restProps}) => {
    return (
        <TextFieldMui 
            type={type}
            label={label}
            {...restProps}
        />
    )
}

export default TextField
