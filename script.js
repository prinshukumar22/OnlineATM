'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-01-11T17:01:17.194Z',
    '2023-01-12T23:36:17.929Z',
    '2023-01-13T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatDates = (date,locale) => {
  const noOfDays = (date1 , date2) => Math.round(Math.abs((date1-date2)/(1000*60*60*24)));
  const daysPassed = noOfDays(new Date(), date)
  console.log(daysPassed)
  if(daysPassed=== 0 ) return 'today';
  if(daysPassed=== 1 ) return 'Yesterday';
  if(daysPassed <= 7 ) return `${noOfDays(new Date(), date)} days ago`;
  let format = new Intl.DateTimeFormat(locale).format(date);
  console.log(format)
  return format
}

const formatNumbers = (number,locale,currency) => {
  let options = {
    style:'currency',
    currency,
    useGrouping: false
  }
  console.log(options)
  let format = new Intl.NumberFormat(locale,options).format(number)
  return format;
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);//looping 2 arrays at the same time
    let displayDate = formatDates(date,acc.locale);
    let money = formatNumbers(mov,acc.locale,acc.currency)
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements_date">${displayDate}</div>
        <div class="movements__value">${money}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatNumbers(acc.balance,acc.locale,acc.currency)}`;
  
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatNumbers(Math.floor(incomes),acc.locale,acc.currency)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatNumbers(Math.floor(out),acc.locale,acc.currency)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatNumbers(Math.floor(interest),acc.locale,acc.currency)}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function(){
  const tick = ()=>{

    let min = String(Math.trunc(time/60)).padStart(2,0);
    let sec = String(time%60).padStart(2,0);
    //In each call,print the remaining time
    labelTimer.textContent=`${min}:${sec}`

    //Logout user when gets to 0
    if(time===0){
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Login to get started`
    }

    //decrease time
    time--;

  }
  let time = 120;
  tick()
  let timer = setInterval(tick,1000)
  return timer;
}

///////////////////////////////////////
// Event handlers
let currentAccount,timer;

//Fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100




btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    // Update UI
    // let date = new Date();
    // let now = `${date.getDate()}`.padStart(2,0);
    // let month = `${date.getMonth()+1}`.padStart(2,0);
    // let year = date.getFullYear()
    // let hours = date.getHours()
    // let minutes = date.getMinutes()
    let now = new Date();
    let options = {
      day:'2-digit',
      month:'2-digit',
      year:'numeric',
      hour:'numeric',
      minute:'numeric'
    };
    const locale = navigator.language
    let format = new Intl.DateTimeFormat(currentAccount.locale,options).format(now)
    labelDate.textContent = format;//`${now}/${month}/${year},${hours}:${minutes}`;
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  clearInterval(timer);
  timer = startLogoutTimer();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  clearInterval(timer);
  timer = startLogoutTimer();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function(){currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString())
    // Update UI
    updateUI(currentAccount);},2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(Math.round('-23.4'))  
console.log(3.73.toFixed(2))
console.log(Math.ceil(-3.7))
console.log(10000n + 'HI ')
console.log(new Date(2037,9,14,23,11))

