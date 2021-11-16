import React, {useEffect, useState} from 'react';
import ConversationList from '../ConversationList';
import { connect } from "react-redux";
import { getSingleChat, getSeenChat, getDeleteChat } from "../../redux/actions/ChatActions";
import MessageList from '../MessageList';
import './Messenger.css';
import LoadingDim from "../LoadingDim";

class Messenger extends React.Component {
  
  componentDidMount() {
    const {props} = this
    window.mySocket.on('connect',function(){
      console.log("connect");
      window.mySocket.emit('join', window.localStorage.getItem('access-token'), null)
    });
    window.mySocket.on("join", function (data) {
      console.log('data of Public Socket Join:::',data);
    });
    window.mySocket.on("sendMessage", data => {
      console.log('Send Messages from public Socket:::',data);
      props.getSingleChat(data.data);
    })
    window.mySocket.on("seen", (data) => {
      console.log('SEEN RESPONSE:::', data);
      props.getSeenChat(data)
    });
    window.mySocket.on("deleteMessage", (data) => {
      console.log('DELETE MESSAGE RESPONSE:::', data);
      props.getDeleteChat(data)
    });
  }

  render() {
    return (
      <div className="messenger">
        <LoadingDim/>
        <div style={{height: '100vh'}} className="scrollable sidebar">
          <ConversationList />
        </div>

        <div id='message-list-scroll' className="scrollable content">
          <MessageList />
        </div>
      </div>
    );
  }
}

export default (
  connect(
      null,
    { getSingleChat, getSeenChat, getDeleteChat }
  )(Messenger)
);