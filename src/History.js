import React from 'react';

export const History = ({history, handler, open}) => {
    const content = open ? "history-content" : "history-content closed"
    return (
        <div className="history">
            <div className="history-control">
                <button className="control-buttons" onClick={()=> handler('open')}>⬆️</button>
                <button className="control-buttons" onClick={()=> handler('empty')}>🗑</button>
                <button className="control-buttons" onClick={()=> handler('close')}>⬇️</button>
            </div>
            <div className={content}>{history.map((ele, i) => <div className="sub-history-content" key={i}>{ele}</div>)}</div>
        </div>
    )
};
