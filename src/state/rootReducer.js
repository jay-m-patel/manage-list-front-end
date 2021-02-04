import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import CSVUploaderReducer from './CSVUploader/reducer'
import MainListReducer from './MainList/reducer'

export default combineReducers({
    form: formReducer,
    CSVUploaderReducer,
    MainListReducer,
})