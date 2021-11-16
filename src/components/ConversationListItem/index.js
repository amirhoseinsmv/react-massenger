import React, {useEffect} from 'react';
import { connect } from "react-redux";
import { getChats } from "../../redux/actions/ChatActions";
import { dimLoading } from "../../redux/actions/WidgetActions";
import shave from 'shave';
import Avatar from '../../assets/avatar.png'
import {dataAxios} from '../../utils'
import ToolbarButton from '../ToolbarButton';

import './ConversationListItem.css';

function ConversationListItem(props) {
  // useEffect(() => {
  //   shave('.conversation-snippet', 20);
  // })

  const getChats = async(id) => {
    props.dimLoading();
    await dataAxios({
      method : 'get',
      url : `api/room/${id}?page=1&size=1000`,
    }).then((res) => {
      props.getChats(res.result)
      console.log('seen when open the room;;;;',res.result.chats[0].chat_id, res.result.roomId)
      window.mySocket.emit("seen", {
        chatId: res.result.chats[0].chat_id,
        roomId: res.result.roomId,
        accessToken: window.localStorage.getItem('access-token')
      });
    }).catch((error) => {
      console.log('there is error in get chats of a room')
    }).finally(() => {
      props.dimLoading();
    })
  }

  const { image, name, text, id, unseenCount, file, isMine, seen, time, chatOwner, type } = props.data;
  var seenIcon = seen ? 'ios-done-all' : 'ios-checkmark'
  var ownerName =  
    type == 'gp' ? 
      isMine ? 'You: ' : `${chatOwner}: `
    : ''
  return (
    <div onClick={() => getChats(id)} key={id} className="conversation-list-item">
      {image == "" ?
        <img className="conversation-photo" src={Avatar} alt="ALT" />
        :
        <img className="conversation-photo" src={image} alt="ALT" />
      }
      <div style={{flexGrow: 5}} className="conversation-info">
        <h1 className="conversation-title">{ name ? name : "UNKNOWN" }</h1>
        {seen !== null &&
          <div style={{display:'flex', alignItems:'center'}}>
            {isMine && <ToolbarButton key="add" icon={`ion-${seenIcon}`} />}
            {file != '' ? 
              <p className="conversation-snippet">file</p>
              :
              <p className="conversation-snippet">{ownerName + text}</p>
            }
          </div>
        }
      </div>
      {seen !== null &&
        <div style={{textAlign:'center'}} className="conversation-info">
          <p className="conversation-snippet font13">{time.slice(16,21)}</p>
          {unseenCount != 0 && <p className="conversation-snippet unseen-badge">{unseenCount}</p>}
        </div>
      }
    </div>
  );
}

export default (
  connect(
      null,
    { getChats, dimLoading }
  )(ConversationListItem)
);