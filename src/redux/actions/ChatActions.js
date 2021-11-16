export const GetChats = "GetChats"
export const GetSingleChat = "GetSingleChat"
export const GetSeenChat = "GetSeenChat"
export const GetDeleteChat = "GetDeleteChat"

export const getChats = data => dispatch => {
    dispatch({
        type: GetChats,
        data: data
    });
};

export const getSingleChat = data => dispatch => {
    dispatch({
        type: GetSingleChat,
        data: data
    });
};

export const getSeenChat = data => dispatch => {
    dispatch({
        type: GetSeenChat,
        data: data
    });
};

export const getDeleteChat = data => dispatch => {
    dispatch({
        type: GetDeleteChat,
        data: data
    })
}
