const url = "https://noroff-komputer-store-api.herokuapp.com/";
const balanceElement = document.getElementById("balance");
const loanElement = document.getElementById("loan");
const element = document.getElementById("div");
const loan = document.getElementById("loan");
const btnLoan = document.getElementById("btnLoan");
const getPayBtn = document.getElementById("payButton");
const buyCompBtn = document.getElementById("buyComputerButton");
const salaryElement = document.getElementById("pay");
const sndMoneyToBankBtn = document.getElementById("sendMoneyToBank");
const computersElement = document.getElementById("computers");
const computerDescriptionElement = document.getElementById("computerDescription");
const computerSpecsElement = document.getElementById("specs");
const computerPicElement = document.getElementById("picture");
const offerTitleElement = document.getElementById("offerTitle");
const offerDescriptionElement = document.getElementById("offerDescription");
const offerPriceElement = document.getElementById("offerPrice");
const imageHolder = document.getElementById("imageHolder");
const imageTag = document.createElement("img");
imageTag.setAttribute("style", "width: 30%");
const specsElement = document.createElement("label");
const payOffLoanBtn = document.getElementById("payOffLoan");
payOffLoanBtn.style.display = "none";

specsElement.innerText = "Specs";
document.getElementById("specsLabel").appendChild(specsElement);

let hasLoan = false;
let hasBoughtComputer;
let totalLoan = 0;
let balance = 0;
let salary = 0;
let computers = [];
let computerSpecs;
let computerPic;
let offerPrice;

const updateDisplayedBalance = () => {

    balanceElement.innerText = balance;
}

const updateSalaryElement = () => {
    salaryElement.innerText = salary;
}

/**
 * The function updates the loan.
 * If a user has a loan there are two options to repay the loan.
 * This functuon handles one of the options.
 * When a sum is transfered from the salary to the bank balance 10 % of the transfering sum is to be deducted in order to repay the loan.
 */
const updateLoan = () => {
    if (totalLoan - salary * 0.1 < 0) {
        balance = balance + (salary * 0.1 - totalLoan) + (salary-salary*0.1);
        totalLoan = 0;
        updateDisplayedBalance();
        salary=0;
        updateSalaryElement();
        document.getElementById("loan").innerText = totalLoan;
        document.getElementById("loanStatus").innerText = "";
    } else {
        totalLoan = Number(totalLoan) - Number(salary * 0.1);
        document.getElementById("loan").innerText = totalLoan;
        if (totalLoan === 0) {
            hasLoan = false;
            document.getElementById("loanStatus").innerText = "";
        }
    }
}



updateDisplayedBalance();

/**
 * The fetch gets the devices to be displayed and bought by the user
 */
fetch(`${url}computers`).then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputersToMenu(computers));


/**
 * 
 * @param {*} computers = An array computers to be viewed and potentially bought by the user.
 * For each of the devices avaiable a element is created, given the respective id and in turn appended into a gathering element which will consist of all the computers avaiable.
 * The user is to use the "computersElement" element to choose which device to view. 
 * The default device that is viewed is the first one added to the "computersElement" element.
 */
const addComputersToMenu = (computers) => {
    computers.forEach(x => {
        const computerElement = document.createElement("option");
        computerElement.value = x.id;
        computerElement.appendChild(document.createTextNode(x.title));
        computersElement.appendChild(computerElement);
        offerDescriptionElement.innerText = ">" + computers[0].description;
        let temp = "";
        computers[0].specs.forEach(x => {
            temp += ">" + x + "\n";
        })
        computerSpecsElement.innerText = temp;
        imageTag.setAttribute("src", `https://noroff-komputer-store-api.herokuapp.com/assets/images/1.png`);
        imageHolder.appendChild(imageTag);
        offerTitleElement.innerText = computers[0].title;
        offerDescriptionElement.innerText = ">" + computers[0].description;
        offerPriceElement.innerText = computers[0].price;
        offerPrice = computers[0].price;
    }
    )
}

/**
 * The function displays the selected device both to vies the specific device and the informations displayed in the purchase section of the site.
 */

const handleSelectedComputer = e => {
    const selectedComputer = computers[e.target.selectedIndex];
    offerDescriptionElement.innerText = ">" + selectedComputer.description;
    computerSpecs = selectedComputer.specs;
    imageTag.setAttribute("src", `${url}${selectedComputer.image}`);
    imageHolder.appendChild(imageTag);
    let temp = "";
    computerSpecs.forEach(x => {
        temp += ">" + x + "\n";
    })
    computerSpecsElement.innerText = temp;
    offerTitleElement.innerText = selectedComputer.title;
    offerDescriptionElement.innerText = selectedComputer.description;
    offerPriceElement.innerText = selectedComputer.price;
    offerPrice=selectedComputer.price;
}



/**
 * The function allows the user to geat a loan if all of the following conditions are met;
 * 1) The loan can be a maxium value of twice the balance that the user has on his account
 * 2) The user has no prexisting loans
 * 3) If the user is trying to get a second loan the prior loan needs to be used to purchase a computer.
 */
const getALoan = () => {
    let loan = prompt("Enter the amount you wish to loan", "100");
    if (loan > parseInt(balance * 2)) {
        console.log('The sum is to high');
        alert("The sum is to high");
    } else if (hasLoan === true) {
        console.log('You already have a loan');
        alert("You already have a loan");
    } else if (hasBoughtComputer === false) {
        console.log('You need to buy a computer');
        alert("You need to buy a computer");
    }
    else {
        totalLoan = Number(totalLoan) + Number(loan);
        document.getElementById("loan").innerText = totalLoan;
        balance = balance + totalLoan;
        balanceElement.innerText = balance;
        hasLoan = true;
        payOffLoanBtn.style.display = "inline";


    }
}

/**
 * The function adds upon the users salary.
 */
const updateSalary = () => {

    salary = salary + 100;
    updateSalaryElement();
}


/**
 * The function attempts to pay off the existing loan of the user.
 * Three of the outcomes are handled by each of the "if" & "else if" statements.
 * The first outcome handles the case where the user has amount left after paying of the loan at which point the remaining amount is left as a salary.
 * The second outcome handles the case where all the salary amount is used to pay off the entirity of the loan.
 * The third and last case deducts the entire salary amount from the loan which in this case remains.  
 */
const payOffLoan = () => {
    if (salary - totalLoan > 0) {
        if (Number(totalLoan) - Number(salary) < 0) {
            salary = salary - totalLoan;
            totalLoan = 0;
            document.getElementById("loan").innerText = totalLoan;
            updateSalaryElement();
            hasLoan = false;
            payOffLoanBtn.style.display = "none";


        }
    } else if (Number(salary) - Number(totalLoan) === 0) {
        totalLoan = Number(totalLoan) - Number(salary);
        document.getElementById("loan").innerText = totalLoan;
        salary = salary - totalLoan;
        updateSalaryElement();
        hasLoan = false;
        payOffLoanBtn.style.display = "none";

    } else if (Number(totalLoan) - Number(salary) > 0) {
        totalLoan = Number(totalLoan) - Number(salary);
        salary = 0;
        document.getElementById("loan").innerText = totalLoan;
        updateSalaryElement();
    }
}

/**
 * The function handels the transfer of the user salary amount to the bank balance.
 * There are two outcomes this function handles. 
 * The first outcome deducts the amount being transfered to the bank balance by 10 % in order to pay of the users current loan.
 * If the user currently does not have a loan the entire sum is being transfered to the bank balance. 
 */
const updateBalance = () => {
    if (hasLoan === true && totalLoan > 0) {
        if (totalLoan - salary * 0.1 >= 0) {
            updateLoan(salary);
            console.log(hasLoan + " " + totalLoan);
            balance = balance + salary - salary * 0.1;
            salary = 0;
            updateSalaryElement();
            updateDisplayedBalance();

        } else if (totalLoan - salary * 0.1 < 0) {
            updateLoan(totalLoan);
            updateSalaryElement();
            updateDisplayedBalance();
        }
    } else {
        balance += salary;
        updateDisplayedBalance();
        salary = 0;
        updateSalaryElement();
        if (salary <= 0) {
            payOffLoanBtn.style.display = "none";
        }
    }
}
/**
 * The function attempts to buy a computer if the users bank balance is sufficent for the price of the computer at which case the price sum is deducted from the users bank balance.
 */
const buyComputer = () => {

    if (balance < offerPrice) {
        alert("You dont have enoug money");
    } else if (balance >= offerPrice) {
        balance = balance - offerPrice;
        balanceElement.innerText = balance;
        hasBoughtComputer = true;
        alert("You have bought a computer");
    }
}

/**
 * The function displays the "Pay off loan" button if the user has a loan.
 */
const togglePayBtn = () => {
    if (salary > 0) {
        payOffLoanBtn.style.display = "inline";
    }
}

sndMoneyToBankBtn.addEventListener("click", updateBalance);
btnLoan.addEventListener("click", getALoan);
getPayBtn.addEventListener("click", updateSalary);
payOffLoanBtn.addEventListener("click", payOffLoan);
buyCompBtn.addEventListener("click", buyComputer);
computersElement.addEventListener("change", handleSelectedComputer);