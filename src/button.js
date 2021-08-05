import React from 'react';


const Button = ({ value, handler }) => {
    return <button onClick={() => handler(value)}>value</button>
}

export default Button;
