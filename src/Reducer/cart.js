const initialState = 0;

export const cartItem = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': return action.data
        default : return state
    }
}


// this is only for practice
// const initialState2 = [];
// export const sendData = (state = initialState2, action) => {
//     switch (action.type) {
//         case 'SEND_DATA': return action.data
//         default : return state
//     }
// }