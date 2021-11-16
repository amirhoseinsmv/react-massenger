import React, {useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import { connect } from "react-redux";
import { dimLoading } from "../../redux/actions/WidgetActions";
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import {dataAxios} from '../../utils'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '../../assets/avatar.png'
import { TextField, Checkbox, List, ListItemAvatar, ListItem, DialogActions, ListItemText, ListItemSecondaryAction, Divider, Button} from '@material-ui/core';

import './ConversationList.css';
import { keys } from '@material-ui/core/styles/createBreakpoints';

function ConversationList(props) {

  const [conversations, setConversations] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [chosenUser, setChosenUSer] = useState([])
  const [gpName, setGpName] = useState('')
  const [renderItems, setRenderItems] = useState(false)
  var unReadMessage = JSON.parse(window.localStorage.getItem('unReadMessages'))

  useEffect(() => {
    getConversations()
  },[window.localStorage.getItem('access-token')])

  useEffect(() => {
    //update all rooms that have 0 unread message with every ls changes
    var a = JSON.parse(window.localStorage.getItem('unReadMessages'))
    if(conversations.length != 0 && props.chats.roomId) {
      // var fullSeenRoomsId = Object.keys(a).filter(m => a[m] == 0)
      var newConversations = [...conversations]
      // for(var roomID of fullSeenRoomsId) {
        var roomIndex = newConversations.findIndex((con) => con.id == props.chats.roomId)
        newConversations[roomIndex].unseenCount = 0
        setRenderItems(!renderItems)
      // }
      setConversations(newConversations)
    }
  },[unReadMessage && props.chats.roomId])

  useEffect(() => {
    if(props.singleChat.chat_id) {
      var newConversations = [...conversations]
      var roomId = newConversations.findIndex((con) => con.id == props.singleChat['room_id'])
      var userInfo = JSON.parse(window.localStorage.getItem("user-info")) 
      if(props.chats.roomId == conversations[roomId].id) {
        unReadMessage[`${conversations[roomId].id}`] = 0
        window.localStorage.setItem('unReadMessages', JSON.stringify(unReadMessage))
      }else {
        unReadMessage[`${conversations[roomId].id}`]++
        window.localStorage.setItem('unReadMessages', JSON.stringify(unReadMessage))
      }
      newConversations[roomId] = {
        type: conversations[roomId].type,
        id: conversations[roomId].id,
        image: conversations[roomId].image,
        name: conversations[roomId].name,
        unseenCount: unReadMessage[`${conversations[roomId].id}`] ,
        chatId: props.singleChat["chat_id"],
        file: "",
        isMine: props.singleChat.user ? props.singleChat.user.username == userInfo.username : false,
        seen: false,
        text: props.singleChat.text,
        time: new Date(props.singleChat.time).toString(),
        chatOwner: props.singleChat.user ? props.singleChat.user.username : "Unknown"
      }
      setConversations(newConversations)
    }
  },[props.singleChat.chat_id])

  useEffect(() => {
    console.log('props.seenChat.chatId;;;;;',props.seenChat)
    if(props.seenChat.chatId) {
      var newConversations = [...conversations]
      var index = newConversations.findIndex((con) => con.id == props.seenChat['roomId'])
      newConversations[index].seen = true
      setConversations(newConversations)
      //this just because of forcing component to re render after updating seen message ( that's bad idea but is good for 1 week demo project)
      setRenderItems(!renderItems)
    }
  },[props.seenChat.chatId])

 const getConversations = async() => {
    props.dimLoading();
    await dataAxios({
      method : 'get',
      url : `api/room/rooms?lastSeen=${window.localStorage.getItem('lastSeen')}`,
    }).then((res) => {
      var unReadMessages = {}
      for(var conversation of res.result.summary) {
        if(unReadMessage) {
          if(unReadMessage[`${conversation.room_id}`]) {
            unReadMessages[`${conversation.room_id}`] = conversation["total_unseen_messages"] + unReadMessage[`${conversation.room_id}`]
          }else {
            unReadMessages[`${conversation.room_id}`] = conversation["total_unseen_messages"]
          }
        }else{
          unReadMessages[`${conversation.room_id}`] = conversation["total_unseen_messages"]
        }
      }
      window.localStorage.setItem('unReadMessages', JSON.stringify(unReadMessages))
      let newConversations = res.result.rooms.map(room => {
        var summary = res.result.summary.filter((s) => s['room_id'] == room.id )[0]
        var roomID = Object.keys(unReadMessages).find(a => a == room.id)
        var unSeenCount = unReadMessages[`${roomID}`]
        if(summary.chats.length == 0) {
          //serfan baraye sorate kar in kare kasif anjam shd :) nadide begirid
          var lastChat = {
            is_my_message : null,
            seen: null,
            text: '',
            time: new Date(),
            user: {username: ''}
          }
        }else {
          var lastChat = summary.chats[0]
        }
        if(room.type == "Group") {
          return {
            type: 'gp',
            id: room.id,
            image: room.room.image,
            name: room.room.roomName,
            unseenCount: unSeenCount,
            chatId: lastChat["chat_id"],
            file: lastChat.file,
            isMine: lastChat["is_my_message"],
            seen: lastChat.seen,
            text: lastChat.text,
            time: new Date(lastChat.time).toString(),
            chatOwner: lastChat.user.username
          };
        }else {
          return {
            type: 'pv',
            id: room.id,
            image: room.room.image == "" ? room.room.image : "http://45.149.76.230" + room.room.image,
            name: room.room.username,
            unseenCount: unSeenCount,
            chatId: lastChat["chat_id"],
            file: lastChat.file,
            isMine: lastChat["is_my_message"],
            seen: lastChat.seen,
            text: lastChat.text,
            time: new Date(lastChat.time).toString(),
            chatOwner: lastChat.user.username
          };
        }
      });
      console.log("sssssssssssssssssss", newConversations)
      setConversations(newConversations)
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
  }

  const openAddRoomDialog = async() => {
    props.dimLoading();
    await dataAxios({
      method : 'get',
      url : 'api/users/all',
    }).then((res) => { 
      var users = []
      for(var user of res.result.users) {
        users.push({
          username: user.username,
          name: user.name,
          avatar: user.image
        })
      }
      console.log("res::",users)
      setAllUser(users)
      setOpen(true)
    }).catch((error) => {
      console.log("EROR::",error)
    }).finally(() => {
      props.dimLoading();
    })
  }

  const createRoom = async() => {
    if(chosenUser.length != 0) {
      props.dimLoading();
      if(chosenUser.length == 1){
        var data = {
          room_type : 'pv',
          users : chosenUser,
          admins : [],
          room_name : ''
        }
      }else{
        var data = {
          room_type : 'gp',
          users : chosenUser,
          admins : [],
          room_name : gpName
        }
      }
      await dataAxios({
        method : 'post',
        url : 'api/chat',
        data: data
      }).then((res) => { 
        console.log("res::",res)
        setOpen(false)
        getConversations()
      }).catch((error) => {
        console.log("EROR::",error)
      }).finally(() => {
        props.dimLoading();
      })
    }
  }

  const changeChosenUser = (username) => {
    const currentIndex = chosenUser.indexOf(username);
    const newChoseUser = [...chosenUser];

    if (currentIndex === -1) {
      newChoseUser.push(username);
    } else {
      newChoseUser.splice(currentIndex, 1);
    }

    setChosenUSer(newChoseUser);
  }

    return (
    <>
      <div className="conversation-list">
        <Dialog maxWidth='sm' fullWidth open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">New Chat</DialogTitle>
          <DialogContent>
            {chosenUser.length > 1 && 
              <TextField
                autoFocus
                style={{width: '60%'}}
                margin="dense"
                id="name"
                label="Group name"
                onChange = { (e) => setGpName(e.target.value) }
                type="text"
                value = {gpName}
              />
            }
            <List>
              {allUser.map ((user, idx) => {
                return(
                  <React.Fragment key={idx}>
                    <ListItem>
                      <ListItemAvatar>
                        {user.avatar == "" ?
                          <img className="conversation-photo" src={Avatar} alt="ALT" />
                          :
                          <img className="conversation-photo" src={`http://45.149.76.230${user.avatar}`} alt="ALT" />
                        }
                      </ListItemAvatar>
                      <ListItemText primary={user.name} secondary={`@${user.username}`} />
                      <ListItemSecondaryAction>
                        <Checkbox
                          edge="end"
                          onChange={() => changeChosenUser(user.username)}
                          checked={chosenUser.indexOf(user.username) !== -1}
                        />
                      </ListItemSecondaryAction>
                      
                    </ListItem>
                    <Divider variant="middle" />
                  </React.Fragment>
                )
              })}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => createRoom()} color="primary">
              Create
            </Button>
            <Button onClick={() => setOpen(false)} style={{color: 'red'}}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Toolbar
          title="Messenger"
          // leftItems={[
          //   <ToolbarButton handleClick = {() => setOpen(!open)} key="login" icon="ion-ios-log-in" />
          // ]}
          rightItems={[
            <ToolbarButton handleClick={() => openAddRoomDialog()} key="add" icon="ion-ios-add-circle-outline" />
          ]}
        />
        <ConversationSearch />
        {
          conversations.map(conversation =>
            <ConversationListItem
              key={conversation.id}
              data={conversation}
              render = {renderItems}
            />
          )
        }
      </div>
    </>);
}

const mapStateToProps = state => ({
  chats: state.chatData.chats,
  singleChat: state.chatData.singleChat,
  seenChat: state.chatData.seenChat
});

export default (
  connect(
      mapStateToProps,
    { dimLoading }
  )(ConversationList)
);