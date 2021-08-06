import React from 'react';

const History = (history, handler) => {
    const subHistory = history.map((ele, i) => <div className="sub-history-content closed" key={i}>{ele}</div>);

    return (
        <div className="history">
            <div className="history-control">
                <button className="control-buttons" onClick={()=> handler('open')}>⬆️</button>
                <button className="control-buttons" onClick={()=> handler('empty')}>🗑</button>
                <button className="control-buttons" onClick={()=> handler('close')}>⬇️</button>
            </div>
            <div className="history-content">{subHistory}</div>
        </div>
    )
}
