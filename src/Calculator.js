import React, { useState } from 'react';
import Button from './button';
import {History} from './History';
import { onePercent, addOrSubtractDecimals, division, multiply } from './MathCalculations';



const Calculator = () => {
    const [display, setDisplay] = useState('0');

    //index of where the last number starts in the display. points outside of display if the last value is not a number
    const [currentNumStart, setStart] = useState(0);

    //tracks wether last number in display is a decimal or not
    const [currentNumIsDec, setNumIsDec] = useState(false);

    const [history, setHistory] = useState([]);

    function handleClick (value, className) {

        //handles appending numbers to the current display
        if (className === 'int-buttons') {

            //ensures decimals and zeros are not improperly added
            if (
                (value === '.' && (currentNumIsDec ||display[currentNumStart] === undefined)) || 
                (value === 0 && display[currentNumStart] === undefined)
            ) {
                return;
            }

            //
            if (display === '0' && value !== '.') {
                setDisplay(String(value));
                return;
            }

            if (value === '.') {
                setNumIsDec(true);
            }
    
            setDisplay(display + String(value));
        }
    
        //handles negating if the last value in display is a number
        if (value === '±') {
            
            if (display[currentNumStart] === undefined || display === '0') {
                return;
            }

            const currentNum = display.slice(currentNumStart);
    
            setDisplay(`${display.slice(0, currentNumStart)}${currentNum[0] === '-' ? currentNum.slice(1) : `-${currentNum}`}`);
        }

        //calls onePerecent on the last number of display  
        if (value === '%') {
            
            //return  if the last value in display is not a number
            if (display[currentNumStart] === undefined || display === '0') {
                return;
            }

            const currentNum = display.slice(currentNumStart)

            //currentNum will become a decimal if its two least signifigant digits are not zero
            if (!currentNumIsDec && (!(currentNum.at(-1) === '0') || !(currentNum.at(-2) === '0'))) {
                setNumIsDec(true);
            }

            setDisplay(`${display.slice(0, currentNumStart)}${onePercent(currentNum)}`);
        }
    
        if (value === 'C') {
            setDisplay('0');
            setNumIsDec(false);
            setStart(0);
            return
        }

        if (value === '=') {
            return
        }

        if (className === 'op-buttons') {
            
            if (display[currentNumStart] === undefined) {
                setDisplay(`${display.slice(0, currentNumStart - 3)} ${value} `);
                return;
            }

            setNumIsDec(false);
            setStart(display.length + 3);
            setDisplay(`${display} ${value} `);
        }
    
    }

    const controlValues = ['C', '±', '%', '÷', 7, 8, 9, 'x', 4, 5, 6, '–', 1, 2, 3, '+', 0, '.', '='].map(value => <Button key={String(value)} value={value} handler={handleClick} />);
    

    return (
        <div className='container'>
            <div className='display'>
                {display}
            </div>
            {controlValues}
        </div>
    )
}

export default Calculator;
