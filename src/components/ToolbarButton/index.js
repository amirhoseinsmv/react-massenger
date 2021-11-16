import React from 'react';
import './ToolbarButton.css';

export default function ToolbarButton(props) {
    const { icon, handleClick, style } = props;
    return (
      <i style={style} onClick = {() => handleClick()} className={`toolbar-button ${icon}`} />
    );
}