import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import {
    get as _get,
    map as _map,
    findIndex as _findIndex,
} from 'lodash'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const NavList = [
    {label: "Main List", path: "/"},
    {label: "Upload CSV File", path: "/upload-csv"},
]

const Navbar = ({ history, location, ...restProps }) => {

    const classes = useStyles();
    const [navIndex, setNavIndex] = useState(0);
    const [loc, setLoc] = useState("/")
    
    useEffect(() => {
        if(location.pathname !== loc) {
            const newNavIndex = _findIndex(
                NavList,
                ({path}) => {
                    console.log(path, location.pathname, path === location.pathname)
                    return path === location.pathname
                }
            )
            setNavIndex(newNavIndex)
            setLoc(location.pathname)
        }
    }, [location.pathname, loc])



    const handleChange = (event, index) => {
        setNavIndex(index);
        const newLoc = _get(NavList, `[${index}].path`)
        setLoc(newLoc)
        history.push(newLoc)
    };

    return (
        <Paper className={classes.root}>
        <Tabs
            value={navIndex}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
        >
            {
                _map(
                    NavList,
                    ({label}, index) => <Tab label={label} key={index}/>
                )
            }
        </Tabs>
        </Paper>
    );
}

export default withRouter(Navbar)