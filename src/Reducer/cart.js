const initialState = 0;

const cartItem = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': return action.data
        default : return state
    }
}

export default cartItem;