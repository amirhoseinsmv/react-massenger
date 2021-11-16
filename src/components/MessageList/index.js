import React from 'react';
import { connect } from "react-redux";
import { dimLoading } from "../../redux/actions/WidgetActions";
import {DialogActions, Button, FormControlLabel, Switch, TextField, Fab, List, ListItemAvatar, ListItem, IconButton, ListItemText, ListItemSecondaryAction, Divider, ListItemIcon} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import Avatar from '../../assets/avatar.png'
import {dataAxios, joinRoom} from '../../utils'
import StarRateIcon from '@material-ui/icons/StarRate';
import StarsIcon from '@material-ui/icons/Stars';
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import './MessageList.css';
import { getSeenChat, getDeleteChat } from "../../redux/actions/ChatActions";
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
class MessageList extends React.Component {

  constructor() {
    super()
    this.state = {
      messages: [],
      roomInfo: {
        name : '',
        type: '',
        image: '',
        description: '',
        id: null  
      },
      open: false,
      members: [],
      file: null,
      mainFile: null,
      gpName: '',
      allCanChat: true,
      myRole: 'member'
    }
  }

  closingCode = e => { 
    e.preventDefault();
    e.returnValue = null;
    var date = new Date()
    window.localStorage.setItem('lastSeen', date.toISOString().slice(0,19))
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.closingCode);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.closingCode);
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const {props} = this
    if(prevProps.chatData.chats !== props.chatData.chats) {
      if(props.chatData.chats.length != 0) {
        if(props.chatData.chats.roomType == 'Group') {
          for(var user of props.chatData.chats.usersInfo) {
            if(user.isMe) {
              this.setState({myRole: user.isOwner? 'owner' : user.isAdmin ? 'admin' : 'member'})
              break;
            }
          }
          this.setState({roomInfo: {
            type: 'gp',
            id: props.chatData.chats.roomId,
            name: props.chatData.chats.roomName,
            image: props.chatData.chats.GroupImage,
            description: `${props.chatData.chats.usersInfo.length} member`
          }})
          this.setState({gpName: props.chatData.chats.roomName})
          this.setState({allCanChat: props.chatData.chats.chatPermission == 'ALL_CAN_TYPE'})
        }else {
          this.setState({roomInfo: {
            type: 'pv',
            id: props.chatData.chats.roomId,
            name: props.chatData.chats.usersInfo.username,
            image: props.chatData.chats.usersInfo.profilePic == "" ? props.chatData.chats.usersInfo.profilePic : "http://45.149.76.230" + props.chatData.chats.usersInfo.profilePic,
            description: props.chatData.chats.usersInfo.isOnline? 'Online' : `Active in ${((new Date(props.chatData.chats.usersInfo.lastSeen)).toString()).slice(16,21)}`
          }})
        }
        this.getMessages(props.chatData.chats.chats)
        joinRoom(window.localStorage.getItem('access-token'), props.chatData.chats.roomId)
        var unReadMessages = JSON.parse( window.localStorage.getItem('unReadMessages') )
        unReadMessages[`${props.chatData.chats.roomId}`] = 0
        window.localStorage.setItem('unReadMessages', JSON.stringify(unReadMessages))
      }
    }
    if(prevProps.chatData.singleChat["chat_id"] !== props.chatData.singleChat["chat_id"]) {
      console.log("single chat recieved !!!", props.chatData.singleChat)
      await this.getSingleMessage()
    }
    if(this.state.file) {
      this.changeGpImg()
    }
    if(prevProps.chatData.seenChat["chatId"] !== props.chatData.seenChat["chatId"]) {
      await this.handleSeenMessage()
    }
    if(prevProps.chatData.deleteChat["chatId"] !== props.chatData.deleteChat["chatId"]) {
      this.handleDeleteMessage()
    }
  }
 
  handleDeleteMessage() {
    var newMessages = this.state.messages.filter(m => m.id != this.props.chatData.deleteChat["chatId"])
    console.log('messages without deleted message',newMessages)
    this.setState({messages: newMessages})
  }

  handleSeenMessage() {
    var updateMessage = [...this.state.messages]
    var index = updateMessage.findIndex((m) => m.id == this.props.chatData.seenChat["chatId"])
    updateMessage[index].seen = true
    this.setState({messages: updateMessage})
  }

  getSingleMessage() {
    const {messages} = this.state
    const {singleChat} = this.props.chatData
    if(this.props.chatData.chats.roomId == singleChat["room_id"]) {
      var index = messages.indexOf(message => message.id == singleChat.chat_id)
      var userInfo = JSON.parse(window.localStorage.getItem("user-info")) 
      if(index == -1 && Object.keys(singleChat).length != 0) {
        var newMessage = {
          id: singleChat.chat_id,
          file: "",
          isMine: singleChat.user ? singleChat.user.username == userInfo.username : false,
          seen: false,
          message: singleChat.text,
          author: singleChat.user ? singleChat.user.username : 'Unknown',
          timestamp: singleChat.time
        }
        this.setState({messages: [...messages, newMessage]})
        window.mySocket.emit("seen", {
          chatId: singleChat.chat_id,
          roomId: singleChat.room_id,
          accessToken: window.localStorage.getItem('access-token')
        });
        // window.mySocket.on("seen", (data) => {
        //   console.log('SEEN RESPONSE:::', data);
        //   this.props.getSeenChat(data)
        // });
      }
    }
    console.log("AD",messages)
  }
  
  getMessages(messages) {
    var allMessages = []
    for( let i=0; i< messages.length; i++) {
      allMessages.push({
        id: messages[i].chat_id,
        file: messages[i].file,
        isMine: messages[i].is_my_message,
        seen: messages[i].seen,
        message: messages[i].text,
        author: messages[i].user.username,
        timestamp: messages[i].time
      })
    }
    allMessages.reverse()
    this.setState({messages: allMessages})
    console.log("ALL MESSAGES LIST::",allMessages)
  }

  renderMessages() {
    const {messages} = this.state
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];
    let seenMessages = messages.filter((message)=> message.isMine && message.seen)
    let lastSeenMessageIndex = messages.indexOf(seenMessages[seenMessages.length - 1 ])
    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.isMine;
      let chatId = current.id
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;
      const {singleChat} = this.props.chatData

      //removing dublicate messages
      if (messages.indexOf(message => message.id == singleChat.chat_id) != -1) {
        continue;
      }
      
      //hame pm haye ghble akharin payame seen shodaro seen mizane
      if(i < lastSeenMessageIndex+1) {
        current.seen = true
      }

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;
        
        if (prevBySameAuthor && previousDuration.as('hours') < 12) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') <12) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 12) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          myRole={this.state.myRole}
          roomType={this.state.roomInfo.type}
          chatId={chatId}
          key={chatId}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );
      // Proceed to the next message.
      i += 1;
      if(i == messageCount-1){this.scroll()}
    }
    return tempMessages;
  }

  async gpDetailsDialog() {
    const {props} = this
    props.dimLoading();
    await dataAxios({
      method : 'get',
      url : `api/room/${this.state.roomInfo.id}/members`,
    }).then((res) => {
      var users = []
      var role = ''
      if(this.state.roomInfo.type == 'gp') {
        for(var user of res.result.userInfo) {
          if(user.isAdmin) {
            role = 'admin'
          }else if(user.isOwner) {
            role = 'owner'
          }else {
            role = 'member'
          }
          users.push({
            name: user.firstName,
            username: user.username,
            avatar: user.profilePic,
            isMe: user.isMe,
            role: role
          })
        }
      }else {
        users.push({
          name: res.result.userInfo.firstName,
          username: res.result.userInfo.username,
          avatar: res.result.userInfo.profilePic,
          role: role,
          isMe: false,
        })
      }
      this.setState({members: users})
      console.log("resss::",users)
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
    this.setState({open: true})
  }

  async changeGpImg() {
    const {props} = this
    props.dimLoading();
    let data = new FormData;
    data.append('image', this.state.mainFile);
    data.append('roomId', this.state.roomInfo.id);
    await dataAxios({
      method : 'post',
      url : 'api/room/profile',
      data: data,
    }).then((res) => {
      console.log("resss::",res)
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
  }

  async changeGpName() {
    const {props} = this
    if(this.state.gpName != '') {
      props.dimLoading();
      let data = {
        roomId: this.state.roomInfo.id,
        groupName: this.state.gpName
      }
      await dataAxios({
        method : 'put',
        url : 'api/room',
        data: data,
      }).then((res) => {
        console.log("resss::",res)
      }).catch((error) => {
        console.log("EROR::",error)
      }).finally(() => {
        props.dimLoading();
      })
    }
  }

  async handleChangeChatType() {
    const {props} = this
    props.dimLoading();
    let data = {
      roomId: this.state.roomInfo.id,
      type: this.state.allCanChat ? 'ONLY_ADMINS_CAN_TYPE' : 'ALL_CAN_TYPE'
    }
    await dataAxios({
      method : 'put',
      url : 'api/room/chat-type',
      data: data,
    }).then(async(res) => {
      console.log("resss::",res.result['chat-permission'])
      this.setState({allCanChat: res.result['chat-permission'] == 'ALL_CAN_TYPE'})
      console.log("ALL CAN CHAT ????", this.state.allCanChat)
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
  }

  async handleLeave() {
    const {props} = this
    props.dimLoading();
    await dataAxios({
      method : 'delete',
      url : `api/room/${this.state.roomInfo.id}/leave`,
    }).then((res) => {
      console.log("resss::",res)
      window.location.reload();
      // if(res.result.message == 'the type has been changed') {setAllCanChat(allCanChat == 'ALL_CAN_TYPE')}
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
  }

  handleCloseDialog() {
    this.setState({file: null})
    this.setState({open: false})
    this.setState({mainFile: null})
  }

  async handleRemoveAdmin(username) {
    const {props} = this
    props.dimLoading();
    let data = {
      roomId: this.state.roomInfo.id,
      username: username
    }
    console.log("handle remoce admin", data)
    await dataAxios({
      method : 'delete',
      url : 'api/room/admin',
      data: data,
    }).then((res) => {
      console.log("resss::",res)
      this.gpDetailsDialog()
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
  }

  async handleMakeAdmin(username) {
    const {props} = this
    props.dimLoading();
    let data = {
      roomId: this.state.roomInfo.id,
      username: username
    }
    console.log("handle make admin", data)
    await dataAxios({
      method : 'post',
      url : 'api/room/admin',
      data: data,
    }).then((res) => {
      console.log("resss::",res)
      this.gpDetailsDialog()
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
  }

  async handleRemoveFromGp(username) {
    const {props} = this
    props.dimLoading();
    let data = {
      roomId: this.state.roomInfo.id,
      username: username
    }
    console.log("handle remove from gp", data)
    await dataAxios({
      method : 'delete',
      url : 'api/room/user',
      data: data,
    }).then((res) => {
      console.log("resss::",res)
      this.gpDetailsDialog()
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
  }

  async handleRemoveGp() {
    const {props} = this
    props.dimLoading();
    let data = {
      roomId: this.state.roomInfo.id,
    }
    await dataAxios({
      method : 'delete',
      url : 'api/room',
      data: data,
    }).then((res) => {
      console.log("resss::",res)
      window.location.reload();
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
  }

  async handleClearHistory() {
    const {props} = this
    props.dimLoading();
    await dataAxios({
      method : 'delete',
      url : `api/chat/chat-history/${this.state.roomInfo.id}`,
    }).then((res) => {
      console.log("resss::",res)
      window.location.reload();
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
  }

  scroll() {
    if(document.getElementsByClassName('scrollable')[1].scrollHeight) {
      var messageBody = document.getElementsByClassName('scrollable')[1];
      messageBody.scrollTop = messageBody.scrollHeight;
    }
  }

  render() {
    const {roomInfo, open, file, allCanChat, members, gpName, myRole} = this.state
    return(
      <div className="message-list" style={{display: 'flex', flexDirection:'column'}}>
        {roomInfo.id ? (
          <>
            {/* room details dialog */}
            <Dialog maxWidth='sm' fullWidth open={open} onClose={() => this.handleCloseDialog()} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Group Details</DialogTitle>
              <DialogContent>
                {roomInfo.type == 'gp' &&
                  <div className='gp-details-edit'>
                    <label className='addAvatar-container' htmlFor="upload-photo">
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-photo"
                        name="upload-photo"
                        type="file"
                        onChange={(e)=> {
                            if (e.target.files && e.target.files[0]) {
                              this.setState({file: URL.createObjectURL(e.target.files[0])})
                              this.setState({mainFile: e.target.files[0]})
                            }
                        }}
                      />
                      {file ? (
                        <img className='avatar-preview' src={file}/>
                      ):(
                        <Fab className='w-100 h-100 addAvatar' disableFocusRipple disableRipple component="span" aria-label="add">
                          <PhotoCamera/>
                        </Fab>
                      )}
                    </label>
                    <span>{file? 'Change Photo': 'Set Photo'}</span>
                    <div className='gp-name-con'>
                      <TextField
                        autoFocus
                        style={{width: '60%'}}
                        margin="dense"
                        id="name"
                        label="Group name"
                        onChange = {(e) => this.setState({gpName: e.target.value})}
                        type="text"
                        value = {gpName == '' ? roomInfo.name : gpName}
                      />
                      <FormControlLabel
                        control={<Switch checked={allCanChat} onChange={() => this.handleChangeChatType()} color="primary" />}
                        label={allCanChat? 'All can chat' : 'Chat only by admin'}
                        labelPlacement="end"
                      />
                    </div>
                  </div>
                }
                <List>
                  {members.map ((member, idx) => {
                    return(
                      <React.Fragment key={idx}>
                        <ListItem>
                          <ListItemAvatar>
                            {member.avatar == "" ?
                              <img className="conversation-photo" src={Avatar} alt="ALT" />
                              :
                              <img className="conversation-photo" src={`http://45.149.76.230${member.avatar}`} alt="ALT" />
                            }
                          </ListItemAvatar>
                          <ListItemText primary={member.name} secondary={`@${member.username}`} />
                          {roomInfo.type == 'gp' &&
                            <ListItemSecondaryAction>
                              {member.role == 'owner' ? <StarsIcon/> :member.role == 'admin' ? <StarRateIcon/> : null}
                              {(!member.isMe && member.role != 'owner' && myRole != 'member') ?  <>
                                {member.role == 'admin' ?
                                  <IconButton onClick={() => this.handleRemoveAdmin(member.username) }  edge="end" aria-label="details">
                                    <TrendingDownIcon/>
                                  </IconButton> 
                                :
                                  <IconButton onClick={() => this.handleMakeAdmin(member.username) }  edge="end" aria-label="details">
                                    <TrendingUpIcon/>
                                  </IconButton>
                                }
                                  <IconButton onClick={() => this.handleRemoveFromGp(member.username) }  edge="end" aria-label="details">
                                    <RemoveCircleOutlineIcon/>
                                  </IconButton>
                              </>: null}
                            </ListItemSecondaryAction>
                          }
                        </ListItem>
                        <Divider variant="middle" />
                      </React.Fragment>
                    )
                  })}
                </List>
              </DialogContent>
              {roomInfo.type == 'gp' &&
                <DialogActions>
                  <Button onClick={() => this.changeGpName()} color="primary">
                    confirm
                  </Button>
                  <Button onClick={() => this.handleLeave()} style={{color: 'red'}}>
                    Leave chat
                  </Button>
                  {myRole == 'owner' || myRole == 'admin' ?
                    <Button onClick={() => this.handleRemoveGp()} style={{color: 'red'}}>
                      Remove chat
                    </Button>
                  : null}
                </DialogActions>
              }
            </Dialog>
            <Toolbar
              leftItems={[
                roomInfo.image == "" ? <img key="avatarTop" className="conversation-photo" src={Avatar} alt="ALT" /> : <img key="avatarTop" className="conversation-photo" src={roomInfo.image} alt="ALT" />,
                <p key="infoRomm" style={{marginTop:'15px'}} className="conversation-snippet font13">{ roomInfo.description }</p>
              ]}
              title={roomInfo.name}
              rightItems={[
                <ToolbarButton handleClick = {() => this.gpDetailsDialog()} key="info" icon="ion-ios-information-circle-outline" />,
                <ToolbarButton handleClick = {() => this.handleClearHistory()} key="trash" icon="ion-ios-trash" />,
              ]}
            />

            <div className="message-list-container">{this.renderMessages()}</div>

            {(!allCanChat && myRole=='member') ? 
                <p key="infoRomm" className="conversation-snippet font13 chatPermission">ONLY ADMINS CAN TYPE</p>
              :
                <Compose roomId={roomInfo.id}/>
            }
          </>
        ):(
          <h4 className='select-chat-notice'>select a chat to start messsaging</h4>
        ) }

      </div>
    );
  }
}
const mapStateToProps = state => ({
  chatData: state.chatData,
});

export default (
  connect(
      mapStateToProps,
    { dimLoading, getSeenChat, getDeleteChat }
  )(MessageList)
);
