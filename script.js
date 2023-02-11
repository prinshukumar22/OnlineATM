'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
let currentAcc;
let sort = false;
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const generateUsername = acc => {
  acc.forEach(accno => {
    accno.userName = accno.owner.toLowerCase().split(' ').map(name => name[0]).join(''); 
  })
}

generateUsername(accounts);
console.log(accounts)


const displayUI = acc =>{
  displayMovements(acc.movements);
  displayCurrBalance(acc);
  displayCurrSummary(acc);
}
const displayMovements = function(accountno,sort=false){
  containerMovements.innerHTML = '';
  let movs = sort ? accountno.slice().sort((a,b)=>a-b):accountno
  movs.forEach(function(mov,i){
    const type = mov > 0 ? 'deposit':'withdrawal'
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__value">${mov}</div>
    </div>`
    containerMovements.insertAdjacentHTML('afterbegin',html)
  })
}
const displayCurrBalance = acc =>{
  acc.balance = Number(acc.movements.reduce((acc,curr)=>acc+curr,0))
  labelBalance.textContent = `${acc.balance} EUR`
}
const displayCurrSummary = acc =>{
  const inCome = acc.movements.filter(mov => mov>0).reduce((acc,mov)=>acc+mov,0)

  const outCome = Math.abs(acc.movements.filter(mov => mov<0).reduce((acc,curr)=> acc+curr,0))
  
  const interest = acc.movements.filter(mov => mov>=1).map(mov => (mov*acc.interestRate)/100).reduce((acc,mov)=> acc+mov,0);



  labelSumIn.textContent = inCome;
  labelSumOut.textContent = outCome;
  labelSumInterest.textContent = interest;
}
const displayCurrUser = e =>{
  e.preventDefault();
  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value)
  console.log(currentAcc)
  if(currentAcc?.pin === Number(inputLoginPin.value)){
    console.log("LOGGED IN");
    //DISPLAY UI
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur()

    //DISPLAY WELCOME MESSAGE
    labelWelcome.textContent = `Welcome ${currentAcc.owner.split(' ')[0]}`


    //DISPLAY CURRENT BALANCE
    displayUI(currentAcc)
  }
}
const transferMoney = e =>{
  e.preventDefault();
  let amt = Number(inputTransferAmount.value);
  let receiverAcc = accounts.find(acc => acc.userName===inputTransferTo.value)
  console.log(amt,receiverAcc)
  if(amt>0 && amt<=currentAcc.balance && currentAcc && currentAcc?.userName !== receiverAcc.userName){
    console.log(`It is valid`);
    currentAcc.movements.push(-amt);
    receiverAcc.movements.push(amt);
    displayUI(currentAcc);
  }
  inputTransferAmount.value = inputTransferTo.value = ''
  inputTransferTo.blur()
}
const closeAccount = e => {
  e.preventDefault()
  console.log('delete');
  console.log(inputCloseUsername.value,inputClosePin.value)
  console.log(currentAcc)
  if(currentAcc.userName === inputCloseUsername.value && currentAcc.pin === Number(inputClosePin.value)){
    // console.log('It can be deleted')
    let index = accounts.findIndex(acc => acc.userName===currentAcc.userName);
    console.log(index)
    accounts.splice(index,1);

    //HIDE UI
    containerApp.style.opacity = 0;
  }
}
const loanAmount = e =>{
  e.preventDefault();
  let amt=Number(inputLoanAmount.value)
  if(amt>0 && currentAcc.movements.some(mov => mov>0.1*amt)){
    console.log('Loan approved');
    currentAcc.movements.push(amt);
    displayUI(currentAcc);
  }
  inputLoanAmount.value='';
  inputLoanAmount.blur();
}
const sortMov = e=>{
  e.preventDefault();
  console.log('Sorted')
  displayMovements(currentAcc.movements,!sort);
  sort=!sort;
}


btnLogin.addEventListener('click',displayCurrUser);
btnTransfer.addEventListener('click',transferMoney);
btnClose.addEventListener('click',closeAccount);
btnLoan.addEventListener('click',loanAmount);
btnSort.addEventListener('click',sortMov);
// let user = 'Steven Thomas Williams'
// let userName = user.toLowerCase().split(' ');
// // console.log(userName);
// userName=userName.map(name => name.slice(0,1)).join('');

//flat and flatMap
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements.flat())
// console.log(movements)

//Reduce method using for loop
// let acc = 0
// // let max=0
// for(let i of movements){
//   acc+=i;
// }
// console.log(acc);
// let max=movements.reduce((acc,curr) => acc>curr ? acc : curr,movements[0])
// console.log(max)
// console.log(generateUsername('Steven Thomas Williams'))


/////////////////////////////////////////////////
//Practice over Arrays
//.1
// const totalSumDeposit = accounts.map(acc => acc.movements).flat().filter(mov => mov>0).reduce((acc,curr)=>acc+curr,0);
// console.log(totalSumDeposit);

// //.2
// const num$1000 = accounts.map(acc => acc.movements).flat().filter(mov => mov>=1000).length
// console.log(num$1000)

// //.3
// const summary = accounts.flatMap(acc => acc.movements).reduce((acc,curr) => {
//   // curr>0 ? acc.deposit+=curr : acc.withdrawal+=Math.abs(curr)
//   //or
//   acc[curr>0 ? 'deposit':'withdrawal']+=curr;
//   return acc;
// },{deposit:0,withdrawal:0})

// console.log(summary);

// //.4
// const titleCaseConv = title => {
//  const exceptions = ['a','an','the','but','or','on','in','with']
//   let correctTitle = title.toLowerCase().split(' ').map(word => {
//     // return word[0].toUpperCase() + word.slice(1);
//     return exceptions.includes(word) ? word:word[0].toUpperCase() + word.slice(1);
//   }).join(' ');
//   return correctTitle[0].toUpperCase() + correctTitle.slice(1);
// }
// console.log(titleCaseConv('this is a nice title'))
// console.log(titleCaseConv('a good the but'))

/////////////////////////////////////////////////
// Coding Challenge #1


/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
// const checkDogs = function(jularr,katearr){
//   const shallowJul = jularr.slice();
//   // console.log(shallowJul)
//   const correctjul = shallowJul.splice(1,2);
//   const mergearr = correctjul.concat(katearr);
//   // console.log(mergearr)
//   mergearr.forEach(function(dog,i){
//     const type = dog>=3 ? 'adult':'puppy'
//     if(type==='adult'){
//       console.log(`Dog number ${i+1} is an adult, and is ${dog} years old`);
//     }
//     else if(type==='puppy'){
//     console.log(`Dog number ${i+1} is still a puppy 🐶`)
//     }
    
//   })
// }

// checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3])
// console.log(`------ TEST DATA ---------`)
// checkDogs([9, 16, 6, 8, 3],[10, 5, 6, 1, 4])


// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/



// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
//  const calcAverageHumanAge = ages => {
//   // const humanAge = ages.map(age => age<=2 ? age*2 : age*4 + 16);
//   // console.log(humanAge)
//   // const total = humanAge.filter(age => age>=18).reduce((acc,age) => acc+age,0);
//   // console.log(humanAge.filter(age => age>=18))
//   // return total/(humanAge.filter(age => age>=18).length)

//   return ages.map(age => age<=2 ? age*2 : age*4 + 16).filter(age => age>=18).reduce((acc,age,i,arr)=>{console.log(arr)
//     return acc+(age/arr.length)},0)
// }

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]))

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
dogs.forEach(dog => {
  dog.foodPortion = Math.trunc((dog.weight**0.75)*28);
})

console.log('Resultant dog array ->',dogs);

//2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
const {curFood:sarahDogFood,foodPortion} = dogs.find(dog => dog.owners.includes('Sarah'))
sarahDogFood > foodPortion ? console.log('Its eating too much') : console.log('Its eating too little')

//3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

const ownersEatTooMuch = dogs.filter(dog => dog.foodPortion < dog.curFood).flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs.filter(dog => dog.foodPortion > dog.curFood).flatMap(dog => dog.owners);

console.log(ownersEatTooMuch,ownersEatTooLittle);

//4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`)
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`)

//5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)

console.log(dogs.some(dog => dog.curFood===dog.foodPortion))

//6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
console.log(dogs.some(dog => dog.curFood>dog.foodPortion*0.9 && dog.curFood < dog.foodPortion*1.1))

//7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)

const okayDogs = dogs.filter(dog => dog.curFood>dog.foodPortion*0.9 && dog.curFood < dog.foodPortion*1.1);
console.log(okayDogs);

//8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

const dogShallow = dogs.slice().sort((a,b) => a.foodPortion - b.foodPortion);
console.log(dogShallow)
