import React from 'react'
import { Route, Switch } from 'react-router-dom'

import MainList from './components/MainList/List'
import UploadCSV from './components/UploadCSVForm/Form'

const Routes = () => {
    return (
        <Switch>
            <Route exact={true} path="/" component={MainList} />
            <Route exact={true} path="/upload-csv" component={UploadCSV} />
        </Switch>
    )
}

export default Routes