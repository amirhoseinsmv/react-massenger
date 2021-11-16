import React from 'react';
import moment from 'moment';
import './Message.css';
import ToolbarButton from '../ToolbarButton';

export default function Message(props) {
    const {
      data,
      isMine,
      startsSequence,
      endsSequence,
      showTimestamp,
      roomType,
      myRole,
      chatId
    } = props;
    var seenIcon = data.seen ? 'ios-done-all' : 'ios-checkmark'
    const friendlyTimestamp = moment(data.timestamp).format('LLLL');
    const stringDate = (new Date(data.timestamp)).toString()

    const deleteOtherMessage = (chatId) => {
      console.log('deleteOtherMessage :::: ', chatId)
      window.mySocket.emit("deleteGroupMessageByAdmin", {
        chatId: chatId,
        accessToken: window.localStorage.getItem('access-token')
    });
    }

    const deleteSelfMessage = (chatId) => {
      console.log('deleteSelfMessage :::: ', chatId)
      window.mySocket.emit("deleteSelfMessage", {
        chatId: chatId,
        accessToken: window.localStorage.getItem('access-token')
      });
    }

    return (
      <div className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}>
        {
          showTimestamp &&
            <div className="timestamp">
              { friendlyTimestamp }
            </div>
        }

        <div className="bubble-container">
          <div className="bubble" title={friendlyTimestamp}>
            <p style={{color: isMine? '#ffffffba' : ''}} className="conversation-snippet font13">{(roomType == 'gp' && !isMine) && `${data.author}:`}</p>
            { data.file =='' ? data.message : data.file}
            <div style={{display:'flex', alignItems:'center', maxHeight:'20px', marginTop:'17px'}}>
              {isMine && <ToolbarButton style={{color: isMine? '#ffffffba' : ''}} key="add" icon={`ion-${seenIcon}`} />}
              <p style={{color: isMine? '#ffffffba' : ''}} className="conversation-snippet font13">{stringDate.slice(16,21)}</p>
              {isMine && <ToolbarButton handleClick={() => deleteSelfMessage(chatId)} style={{fontSize: '18px',color: '#ffffffba', marginLeft: '20px'}} key="deleteMessage" icon={`ion-ios-trash`}/>}
              {!isMine && roomType == 'gp' && myRole != 'member' ?
                <ToolbarButton handleClick={() => deleteOtherMessage(chatId)} style={{fontSize: '18px' , marginLeft: '20px'}} key="deleteMessage" icon={`ion-ios-trash`}/>
              :null}
            </div>
          </div>
        </div>
      </div>
    );
}