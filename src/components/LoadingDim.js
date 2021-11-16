import React from "react";
import {Backdrop, CircularProgress} from '@material-ui/core';
import {connect} from "react-redux";

class LoadingDim extends React.Component{
    render() {
        return (
            <div>
                <Backdrop className='back-drop' open={this.props.Loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Loading: state.snackbar.loading,
});

export default connect(mapStateToProps, {})(LoadingDim)