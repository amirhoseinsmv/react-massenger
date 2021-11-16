import {AddDelete, AddList, AddPost, AddRetrieve} from "../actions/DataActions";


const initialState = {
    list:{},
    retrieve:{},
    result: {},
    deleteResult: {}
};

const ListReducer = function(state = initialState, action) {
    switch (action.type) {
        case (AddList) :
            return {
                ...state,
                list:{
                    ...state.list,
                    [action.name]: action.payload
                }
            };
        case(AddRetrieve) :
            return {
                ...state,
                retrieve:{
                    ...state.retrieve,
                    [action.name]: action.payload
                }
            };
        case(AddPost):
            return {
                ...state,
                result:{
                    ...state.result,
                    [action.name]: action.result
                }
            };
        case(AddDelete):
            return {
                ...state,
                deleteResult: {
                    ...state.deleteResult,
                    [action.name]: action.result
                }
            };
        default :
            return {
                ...state
            }
    }
};

export default ListReducer;