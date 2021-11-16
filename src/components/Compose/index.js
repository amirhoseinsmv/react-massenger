import React, {useState} from 'react';
import './Compose.css';
import ToolbarButton from '../ToolbarButton'; 
import Picker from 'emoji-picker-react';
import {sendMessage} from "../../utils"

export default function Compose(props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const onEmojiClick = (event, emojiObject) => {
    setText(text => text += `${emojiObject.emoji}`);
  };

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      handleSend()
    }
  }

  const handleSend = () => {
    sendMessage(
      window.localStorage.getItem('access-token'),
      props.roomId,
      text
    )
    setText('')
  }
  

  return (<>
    {open && <Picker native onEmojiClick={onEmojiClick} />}
    <div className="compose">
      <input
        type="text"
        className="compose-input"
        placeholder="Type a message...."
        onChange= {(e) => setText(e.target.value)}
        value={text}
        onKeyPress={handleKeyPress}
      />

      <ToolbarButton handleClick={() => handleSend()} key='send' icon='ion-ios-send' />
      {/* <ToolbarButton key="photo" icon="ion-ios-camera" /> */}
      {/* <ToolbarButton key="audio" icon="ion-ios-mic" /> */}
      <ToolbarButton handleClick={() => setOpen(!open)} key="emoji" icon="ion-ios-happy" />
    </div>
  </>);
}