import React from 'react';


const Button = ({ value, handler }) => {
    let buttonType = 'op-buttons';

    if (Number.isInteger(value) || value === '.') {
        buttonType = 'int-buttons'
    } 
    
    if(value === 'C' || value === '±' || value === '÷') {
        buttonType = 'spec-buttons';
    }

    return <button className={`buttons ${buttonType}`} onClick={() => handler(value)}>value</button>
}

export default Button;
