export const addtocart = (data)=>{
    return {
        type:'ADD_TO_CART',
        data:data
    }
}

export const removetocart = (data)=>{
    return {
        type:'REMOVE_TO_CART',
        data:data
    }
}