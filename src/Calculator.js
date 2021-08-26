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

    const [showHistory, setShowHistory] = useState(false);

    function handleClick (value, className) {

        //handles appending numbers to the current display
        if (className === 'int-buttons') {

            //ensures decimals are not improperly added
            if ((value === '.' && (currentNumIsDec ||display[currentNumStart] === undefined))) {
                return;
            }

            if (display === 'Error') {
                if (Number.isInteger(value)) {
                    setDisplay(String(value));
                }
                return;
            }

            //ensures zeros are not improperly added
            if (Number.isInteger(value) && display[currentNumStart] === '0' && !currentNumIsDec) {
                setDisplay(`${display.slice(0, currentNumStart)}${value}`);
                return;
            }

            if (value === '.') {
                setNumIsDec(true);
            }
    
            setDisplay(display + String(value));
        }
    
        //handles negating if the last value in display is a number
        if (value === '±') {
            
            if (display[currentNumStart] === undefined || display === '0' || display === 'Error') {
                return;
            }

            const currentNum = display.slice(currentNumStart);
    
            setDisplay(`${display.slice(0, currentNumStart)}${currentNum[0] === '-' ? currentNum.slice(1) : `-${currentNum}`}`);
        }

        //calls onePerecent on the last number of display  
        if (value === '%') {
            
            //return  if the last value in display is not a number
            if (display[currentNumStart] === undefined || display === '0' || display === 'Error') {
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

            if (display[currentNumStart] === undefined) {
                return;
            }

            let equation = display.split(' ');

            for (let i = 1; i < equation.length; i++) {
                if (equation[i] === 'x') {
                    equation = [...equation.slice(0, i - 1), multiply(equation[i - 1], equation[i + 1]), ...equation.slice(i + 2)];

                    i = 1;
                    continue;
                }

                if (equation[i] === '÷') {
                    equation = [...equation.slice(0, i - 1), division(equation[i - 1], equation[i + 1]), ...equation.slice(i + 2)];

                    if (equation[i - 1] === 'Error') {
                        setHistory([...history,  display.slice(currentNumStart, display.length), value, equation[0]]);
                        setNumIsDec(false);
                        setDisplay(equation[i - 1]);
                        setStart(0);
                        return;
                    }

                    i = 1;
                    continue;
                }
            }

            for (let i = 1; i < equation.length; i++) {
                if (equation[i] === '+' || equation[i] === '–') {
                    equation = [...equation.slice(0, i - 1), addOrSubtractDecimals(equation[i - 1], equation[i + 1], equation[i]), ...equation.slice(i + 2)];
                    i = 0;
                    continue;
                }                
            }

            if (display[currentNumStart - 1] === ' ') {
                setHistory([...history,  display.slice(currentNumStart, display.length), value, equation[0]])
            }

            setNumIsDec(equation[0].indexOf('.') !== -1);
            setDisplay(equation[0]);
            setStart(0);
            
            return;
        }

        if (className === 'op-buttons') {
            
            if (display === 'Error') {
                return;
            }


            if (display[currentNumStart] === undefined) {
                setHistory([...history.slice(0, history.length - 1), value]);
                setDisplay(`${display.slice(0, currentNumStart - 3)} ${value} `);
                return;
            }

            setNumIsDec(false);
            setHistory((history.at(-2) !== '=' || history.at(-1) === 'Error') ? [...history, display.slice(currentNumStart, display.length), value] : [...history, value])
            setStart(display.length + 3);
            setDisplay(`${display} ${value} `);
        }
    
    }

    const handleHistory = (status) => {
        if (status === 'open') {
            setShowHistory(true);
        }

        if (status === 'empty') {
            setHistory([]);
        }

        if (status === 'close') {
            setShowHistory(false);
        }
    }

    //the subtraction symbol being used has a UTF-16 code of 8211
    const controlValues = ['C', '±', '%', '÷', 7, 8, 9, 'x', 4, 5, 6, '–', 1, 2, 3, '+', 0, '.', '='].map(value => <Button key={String(value)} value={value} handler={handleClick} />);
    

    return (
    <>
        <div className='container'>
            <div className='display'>
                {display}
            </div>
            {controlValues}
        </div>
        <History history={history} handler={handleHistory} open={showHistory}/>
    </>
    )
}

export default Calculator;
