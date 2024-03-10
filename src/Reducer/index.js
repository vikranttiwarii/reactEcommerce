import {cartItem,sendData} from "./cart";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    cartItem,
    // sendData
})

export default rootReducer;