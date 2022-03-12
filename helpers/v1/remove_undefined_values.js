const removeUndefinedValues = (payload) => {
    
    for(const key in payload) {
        const value = payload[key];
        if(!value) delete payload[key] 
    }

    return payload;

}// End oremoveUndefinedValues 


module.exports = removeUndefinedValues;