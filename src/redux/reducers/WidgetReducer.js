import {
    AcceptDialog,
    CartCount,
    CloseDialog,
    DimLoading,
    ChangePass,
    OpenDialog,
    StartSnack,
    StopSnack,
    AddFile, LoadPercent, RestartFile
} from "../actions/WidgetActions";

const initialState = {
    open: false,
    message: '',
    color: '',
    loading:false,
    cartcount:0,
    percent:null,
    dialog:{
        open:false,
        accepted:false,
        openData:{},
        data:{},
        changePass:''
    },
    dropZone:{}
};

const WidgetReducer = function(state = initialState, action) {
    switch (action.type) {
        case (StartSnack):
            return {
                ...state,
                open: true,
                message: action.data.message,
                color: action.data.color
            };
        case (StopSnack):
            return {
                ...state,
                open: action.payload
            };
        case (DimLoading):
            return {
                ...state,
                loading: !state.loading
            };
        case (OpenDialog):
            return {
                ...state,
                dialog:{
                    ...state.dialog,
                    open: !state.dialog.open,
                    accepted: false,
                    openData: action.payload
                }
            };
        case (ChangePass):
            return {
                ...state,
                dialog:{
                    ...state.dialog,
                    changePass: action.payload
                }
            };
        case (CloseDialog):
            return {
                ...state,
                dialog:{
                    ...state.dialog,
                    open: false,
                    accepted: false
                }
            };
        case (AcceptDialog):
            return {
                ...state,
                dialog: {
                    ...state.dialog,
                    accepted:true,
                    open:false,
                    data: action.data
                }
            };
        case (CartCount):
            return {
                ...state,
                cartcount: action.data
            };
        case (AddFile):
            return {
                ...state,
                dropZone:{
                    ...state.dropZone,
                    [action.payload]:{
                        ...state.dropZone[action.payload],
                        title: action.title,
                        file: action.data
                    }
                }
            };
        case (RestartFile):
            return {
                ...state,
                dropZone:{}
            };
        case (LoadPercent):
            return {
                ...state,
                percent: action.payload
            };
        default:
            return {
                ...state,
            };
        }
};

export default WidgetReducer;
