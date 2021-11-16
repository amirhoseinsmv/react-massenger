
export const StartSnack = "StartSnack";
export const StopSnack = "StopSnack";
export const DimLoading = 'DimLoading';
export const OpenDialog = 'OpenDialog';
export const ChangePass = 'changePass';
export const CloseDialog = 'CloseDialog';
export const AcceptDialog = 'AcceptDialog';
export const CartCount = 'CartCount';
export const AddFile = 'AddFile';
export const LoadPercent = 'LoadPercent';
export const RestartFile = 'RestartFile';

export const startSnack = data => dispatch => {
    dispatch({
        type: StartSnack,
        data: data
    });
};

export const stopSnack = () => dispatch => {
    dispatch({
        type: StopSnack,
        payload: false
    });
};

export const dimLoading = () => dispatch =>{
    dispatch({
        type: DimLoading
    })
};

export const openDialog = (data) => dispatch =>{
    dispatch({
        type: OpenDialog,
        payload: data
    })
};

export const changePass = (data) => dispatch =>{
    dispatch({
        type: ChangePass,
        payload: data
    })
};

export const closeDialog = () => dispatch =>{
    dispatch({
        type: CloseDialog
    })
};

export const acceptDialog = (data) => dispatch =>{
  dispatch({
      type: AcceptDialog,
      data: data
  })
};

export const cartcount = (count) => dispatch =>{
    dispatch({
        type: CartCount,
        data: count
    })
};

export const addFile = (file, name, title) => dispatch =>{
    dispatch({
        type: AddFile,
        payload: name,
        data: file,
        title: title
    })
};

export const restartFile = () => dispatch =>{
    dispatch({
        type: RestartFile,
    })
};

export const loadPercent = (percent) => dispatch =>{
    dispatch({
        type: LoadPercent,
        payload: percent
    })
}