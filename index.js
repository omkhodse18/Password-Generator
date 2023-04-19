const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

// initial value set
let password="";
let passwordlength = 10;
let checkCount = 0;
setIndicator("#ccc");
handleSlider();

// Set password length
function handleSlider(){
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordlength - min)*100/(max - min)) + "% 100%"
}

// Set color
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRandomInt(0,9)
}

function generateLowerCase(){
    // String.fromCharCode() = convert ascii code to string
    return String.fromCharCode(getRandomInt(97, 123));
}

function generateUppwerCase(){
    return String.fromCharCode(getRandomInt(65, 91));
}

const symbols = '~`!@#$%^&*()_-+={[}]|\:;"<,>.?/'; 
function generateSymbol(){
    const randomNum = getRandomInt(0,symbols.length);
    return symbols.charAt(randomNum);
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber||hasSymbol) && passwordlength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordlength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "Error";
    }

    copyMsg.classList.add("active");

    setTimeout( () =>{
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleSlider();
});

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked){
            checkCount++;
        }
    });

    if(passwordlength < checkCount){
        passwordlength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkBox)=>{
    checkBox.addEventListener('change', handleCheckBoxChange);
});

copyBtn.addEventListener('click', (e) =>{
    // if(passwordlength >= 1){
    //     copyContent();
    // }
    // or 
    if(passwordDisplay.value){
        copyContent();
    }
});

function shufflePass(array){
    //Fisher Yates method algo use to shuffle array
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el)=>(str+=el));
    return str;
}

generateBtn.addEventListener('click',()=>{
    // No checkbox is selected

    if(checkCount==0){
        return;
    }

    if(passwordlength < checkCount){
        passwordlength = checkCount;
        handleSlider();
    }

    // create new pass
    

    // remove old pass
    password = "";

    // let put the stuff mention by checkboxes
    // if(upperCaseCheck.checked){
    //     password += generateUppwerCase();
    // }

    // if(lowerCaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let functionsArray = [];
    if(upperCaseCheck.checked){
        functionsArray.push(generateUppwerCase);
    }

    if(lowerCaseCheck.checked){
        functionsArray.push(generateLowerCase);
    }

    if(numbersCheck.checked){
        functionsArray.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        functionsArray.push(generateSymbol);
    }

    // Suppose pass len is 10 and all checkboxes are checked then first you have to add all the checked values.
    // let say pass len = 10, included checked = 4, remaining are 6, so you can add it by using for loop.

    //Compulsory Add to charactors
    for(let i=0;i<functionsArray.length;i++){
        password += functionsArray[i]();
    }


    //Remaining addition
    for(let i=0;i<passwordlength - functionsArray.length;i++){
        let randomIdx = getRandomInt(0, functionsArray.length);
        password += functionsArray[randomIdx]();
    }


    //Shuffle the password
    password = shufflePass(Array.from(password));
    

    // Show in display
    passwordDisplay.value = password;
    

    //calculate strngth
    calculateStrength();
});