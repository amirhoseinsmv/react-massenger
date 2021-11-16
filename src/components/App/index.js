import React, {useEffect} from 'react';
import { Provider } from "react-redux";
import Messenger from '../Messenger';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios'
import { Store } from "../../redux/Store";
import { dataAxios } from "../../utils"

export default function App() {

  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState('');

  useEffect(() => {
    if(window.localStorage.getItem('access-token')) {
      setOpen(false)
      console.log(window.localStorage.getItem('access-token'))
      axios.defaults.headers.common['access-token'] = window.localStorage.getItem('access-token');
    }else {
      setOpen(true)
    }
  },[])

  useEffect(() => {
    if(!open) {
      setUserInfo()
    }
  },[open])

  const handleClose = () => {
    setOpen(false);
  };

  const setUserInfo = async() => {
    if(token != ""){
      await dataAxios({
        method : 'get',
        url : `api/users`,
      }).then((res) => {
        console.log("which user???", res.result.username)
        if(res.result) {
          window.localStorage.setItem('user-info', `{"username": "${res.result.username}", "phoneNum": "${res.result.phoneNumber}"}`)
          window.location.reload()
        }
      }).catch((error) => {
        console.log("which user???", error)
      })
    }
  }

  const getToken = () => {
    window.localStorage.setItem('access-token', token)
    delete axios.defaults.headers.common['access-token'];
    axios.defaults.headers.common['access-token'] = token;
    setOpen(false);
  }
    
  return (
    <Provider store={Store}>
      <div>
        <Dialog maxWidth='xs' fullWidth disableBackdropClick open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Login with Token</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your token !
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="accessToken"
              onChange = { (e) => setToken(e.target.value) }
              type="username"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={getToken} color="primary">
              confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="App">
        <Messenger />
      </div>
    </Provider>
  );
}