//removes trailing zeros 
const removeTailZeros = (dec) => {
    for (let i = dec.length - 1; i > -1; i--) {
        if (dec[i] !== '0') {
            return dec.slice(0, i + 1);
        }
    }
    return ''
}

// Function that returns one pecent of it's input
const onePercent = num => {
    if (num === '0') {
        return num;
    }

    // only the whole number portion needs to be manipulated to get one percent
    const splitDecimals = num[0] === '-' ? num.slice(1).split('.') : num.split('.');

    // if the whole number has no hundreds place the left side is padded with zeros such that it does
    if (splitDecimals[0].length < 3) {
        splitDecimals[0] = '0'.repeat(3 - splitDecimals[0].length) + splitDecimals[0];
    }

    // sets decimal two places to the left
    const numbersBeforeDecimal = splitDecimals[0].slice(0, splitDecimals[0].length - 2);

    const numbersAfterDecimal = removeTailZeros(`${splitDecimals[0].slice(splitDecimals[0].length - 2)}${splitDecimals[1] ?? ''}`);

    if (!numbersAfterDecimal.length) {
        return num[0] === '-' ? `-${numbersBeforeDecimal}` : numbersBeforeDecimal;
    }
    
    const float = `${numbersBeforeDecimal}.${numbersAfterDecimal}`;

    return num[0] === '-' ? `-${float}` : float;
}

//formats numbers to be added or subtracted
const formatAdditionOrSubtraction = (num1, num2) => {
    //creates an array of the integers and decimals
    const intList1 = num1.split('.');
    const intList2 = num2.split('.');

    //if no decimals were present the 1st index is set to the string 0
    intList1[1] = intList1[1] ?? '0';
    intList2[1] = intList2[1] ?? '0';

    //checks to see which number has more decimal places
    const places = intList1[1].length > intList2[1].length ? intList1[1].length : intList2[1].length;

    //if either number had more decimal places the other number is given more decimals to match
    if (places > intList1[1].length) {
        intList1[1] += '0'.repeat(places - intList1[1].length)
    }
    if (places > intList2[1].length) {
        intList2[1] += '0'.repeat(places - intList2[1].length)
    };

    return [intList1, intList2, places]
}


//handles addding or subtracting decimals together
const addOrSubtractDecimals = (num1, num2, operation = '+') => {
    
    const [intList1, intList2, places] = formatAdditionOrSubtraction(num1, num2);
    
    //adds the two numbers as integers
    const sum = operation === '+' ? String(BigInt(intList1.join('')) + BigInt(intList2.join(''))) : String(BigInt(intList1.join('')) - BigInt(intList2.join('')));

    const decimals = sum.slice(sum.length - places);

    let wholeNums = sum.slice(0, sum.length - places);

    if (wholeNums === '-') {
        wholeNums = '-0'
    }

    if (wholeNums === '') {
        wholeNums = '0';
    }
    
    let fixedDecimals = removeTailZeros(decimals);

    
    
    //returns the number with the decimal in the right place
    return fixedDecimals.length ? `${wholeNums}.${fixedDecimals}` : wholeNums;
}

//adjust numbers to be integers usable in the division function
const formatDivisionOrMult = (dividen, divisor) => {
    const splitDividen = dividen.split('.');
    const splitDivisor = divisor.split('.');

    //tracks how many negatives are in the equation
    let negatives = 0;

    //removes sign from number
    if (splitDividen[0][0] === '-') {
        negatives++;
        splitDividen[0] = splitDividen[0].slice(1);
    }
    if (splitDivisor[0][0] === '-') {
        negatives++;
        splitDivisor[0] = splitDivisor[0].slice(1);
    }

    if (splitDividen[1] === undefined) {
        splitDividen[1] = '';
    }
    if (splitDivisor[1] === undefined) {
        splitDivisor[1] = '';
    }
  
    //checks if either number needs its decimals adjust to the same place
    if (splitDividen[1].length > splitDivisor[1].length) {
        splitDivisor[1] += '0'.repeat(splitDividen[1].length - splitDivisor[1].length)
    }

    if (splitDividen[1].length < splitDivisor[1].length) {
        splitDividen[1] += '0'.repeat(splitDivisor[1].length - splitDividen[1].length)
    }

    //appended to the beginning of the quotient/product to indicate positve or negative values 
    const sign = negatives === 1 ? '-' : ''

    //how many numbers behind the decimal
    const decimalAmount = splitDividen[1].length + splitDivisor[1].length;

    //returns the two numbers as integers
    return [splitDividen.join(''), splitDivisor.join(''), sign, decimalAmount];
}

//handles division
const  division = (dividen, divisor, precision = 20) => {
    const [bigDividen, bigDivisor, sign] = formatDivisionOrMult(dividen, divisor);

    if (Number(bigDivisor) === 0) {
        return 'Error: Divide by zero'
    }
    
    //if division has no remainder it will simply divide
    if (BigInt(bigDividen) >= BigInt(bigDivisor) && !(BigInt(bigDividen) % BigInt(bigDivisor))) {
        const remainder = String(BigInt(bigDividen) / BigInt(bigDivisor))
        return remainder === '0' ? '0' : `${sign}${remainder}`;
    }

    let quotient = '';
    let currentQuotient = quotient[quotient.length - 1];

    //i keeps track of how much of the dividen has been processed
    let i = 0;

    //j keeps track of wether the divisor can fit into a given remainder
    let j = 0;
    let remainder = bigDividen[0];

    //keeps track of how many decimals are in the quotient
    let qDec = 0;
    

    //loops to percision or to no remainder
    while (qDec < precision && (remainder !== '0' || i < bigDividen.length)) {

        //if the remainder divisor sized chunks
        if (BigInt(bigDivisor) <= BigInt(remainder)) {

            //how many times the quotient evenly goes into the remainder
            quotient += String(BigInt(remainder) / BigInt(bigDivisor));

            currentQuotient = quotient[quotient.length - 1];

            //the difference between the remainder and the product of how many times the quotient fit into it
            remainder = String(BigInt(remainder) - BigInt(bigDivisor) * BigInt(currentQuotient));

            //the quotient did fit into the remainder so j is set to 0
            j = 0;

            if (i >= bigDividen.length) {
                qDec++;
            }

            continue;
        }

        i++;
        j++;

        //all whole dividen places have been processed so the rest are decimal
        if (i === bigDividen.length) {
            quotient += '.';
        }

        //adds a zero to the quotient if the divisor went into the current dividen place 0 times
        if (j >= 2 && quotient !== '' && quotient !== '.') {
            quotient += '0';

            if (i >= bigDividen.length) {
                qDec++;
            }
        }

        //if all whole dividen places have processed drag down a 0
        if (i >= bigDividen.length) {
            remainder += '0';
            continue;
        }

        //drag down the next whole dividen place
        remainder += bigDividen[i];

    }      
 
    return quotient[0] === '.' ? `${sign}0${removeTailZeros(quotient)}` : `${sign}${removeTailZeros(quotient)}`;
}

const multiply =  (multiplicand, multiplier) => {
    const [bigMultiplicand, bigMultiplier, sign, decimalAmount] = formatDivisionOrMult(multiplicand, multiplier);

    const product = String(BigInt(bigMultiplicand) * BigInt(bigMultiplier));

    const decimals = removeTailZeros(product.slice(product.length - decimalAmount));

    return decimals.length 
        ? `${sign}${product.slice(0, product.length - decimalAmount) || '0'}.${decimals}` 
        : product === '0' 
            ? '0' 
            : `${sign}${product.slice(0, product.length - decimalAmount)}`
        
}

export {onePercent, addOrSubtractDecimals, division, multiply};
