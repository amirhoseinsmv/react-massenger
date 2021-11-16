import {
    GetChats,
    GetSingleChat,
    GetSeenChat,
    GetDeleteChat
} from "../actions/ChatActions";

const initialState = {
    chats: [],
    singleChat : {},
    seenChat: {},
    deleteChat: {}
};

const WidgetReducer = function(state = initialState, action) {
    switch (action.type) {
        case (GetChats):
            return {
                ...state,
                chats: action.data,
            }
            break;
        case (GetSingleChat):
            return {
                ...state,
                singleChat: action.data,
            }
            break;
        case (GetSeenChat):
            return {
                ...state,
                seenChat: action.data
            }
            break;
        case (GetDeleteChat):
            return {
                ...state,
                deleteChat: action.data
            }
        default:
            return {
                ...state,
            }
            break;
        }
};

export default WidgetReducer;
