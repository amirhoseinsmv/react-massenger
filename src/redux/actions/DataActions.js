import {DimLoading, StartSnack} from "./WidgetActions";


export const AddList = 'AddList';
export const AddRetrieve = 'AddRetrieve';
export const AddPost = 'AddPost';
export const AddDelete = 'AddDelete';

export const addList = (list, name) => dispatch =>{
  console.log(list);
  dispatch({
      type: AddList,
      payload: list,
      name: name,
  })
};

export const addRetrieve = (data, name) => dispatch =>{
    dispatch({
        type: AddRetrieve,
        payload: data,
        name: name
    })
};

export function addPost(result, error, message, name){
  return dispatch =>{
      if(result) {
          if (result.status == 200) {
              dispatch({
                  type: StartSnack,
                  data: {color: 'success', message: message.success}
              });
              dispatch({
                  type: AddPost,
                  result: result,
                  name: name
              })
          } else {
              dispatch({
                  type: StartSnack,
                  data: {color: 'error', message: message.error}
              });
              dispatch({
                  type: AddPost,
                  result: result,
                  name: name
              })
          }
      }
      if(error){
          dispatch({
              type: StartSnack,
              data: {color: 'error', message: message.error}
          })
      }
      return dispatch({
          type: DimLoading,
      })
  }
}

export function addDelete(result, message, name){
    return dispatch =>{
            if (result.status == 200) {
                dispatch({
                    type: StartSnack,
                    data: {color: 'success', message: message.success}
                });
                dispatch({
                    type: AddDelete,
                    result: result,
                    name: name
                })
            } else {
                dispatch({
                    type: StartSnack,
                    data: {color: 'error', message: message.error}
                });
                dispatch({
                    type: AddDelete,
                    result: result,
                    name: name
                })
            }
    }
}