import mongoose from "mongoose";

//first looks for first parameter (if its not empty), adds other parameter key if its not empty
export const buildQueryObject = (query,parameters) => {
 const queryObject = parameters.reduce(
    (acc, value) => {
        if (query[value]) {
            acc[value] = query[value];
        }
        return acc

    }, {}
)
return queryObject;
}

/*
export const getObjectById = async (model, id, session) => {
    let result = null;
    if (mongoose.isValidObjectId(id)){
        result = model.findOne({_id: id});
        if (session){
            result = result.session(session);
        }
        return await result;
    }
    return result;
}
*/