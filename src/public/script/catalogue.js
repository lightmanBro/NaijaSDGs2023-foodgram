const newOrderBtn = document.querySelector('#new');
const daily = document.querySelector('#daily')
const weekly = document.querySelector('#weekly');
const past = document.querySelector('#past');
const newOrderContainer = document.querySelector('.new-order');
const aiOrderBtn = document.querySelector('#ai-button');
const dailyOrders = document.querySelector('.normal-orders')
const scheduleOrders = document.querySelector('.schedule-orders');
const goBackToNewOrderFormBtn = document.querySelector('.back');
const newOrderForm = document.querySelector('#new-order-form');
const aiOrderform = document.querySelector('#new-order-form-ai');

const historyContainer = document.querySelector('.right-container');
const historyContainerHead = document.querySelector('.right-container-heading');
aiOrderform.style.display = 'none'
scheduleOrders.style.display = 'none'
dailyOrders.style.display = 'none';
goBackToNewOrderFormBtn.style.display = 'none';

newOrderBtn.addEventListener('click',()=>{
    daily.classList.remove('active');
    weekly.classList.remove('active');
    past.classList.remove('active');
    newOrderBtn.classList.add('active');
    dailyOrders.style.display = 'none'
    scheduleOrders.style.display = 'none'
    historyContainer.style.display = 'none';
    newOrderContainer.style.display = 'block'
})

weekly.addEventListener('click',(e)=>{
    newOrderBtn.classList.remove('active');
    daily.classList.remove('active');
    weekly.classList.add('active');
    past.classList.remove('active');
    dailyOrders.style.display = 'none'
    historyContainer.style.display = 'none';
    newOrderContainer.style.display = 'none'
    scheduleOrders.style.display = 'block'
})

daily.addEventListener('click',()=>{
    newOrderBtn.classList.remove('active');
    daily.classList.add('active');
    weekly.classList.remove('active');
    past.classList.remove('active');
    scheduleOrders.style.display = 'none'
    historyContainer.style.display = 'none';
    newOrderContainer.style.display = 'none'
    dailyOrders.style.display = 'block';
})

past.addEventListener('click',()=>{
    newOrderBtn.classList.remove('active');
    past.classList.add('active');
    weekly.classList.remove('active');
    daily.classList.remove('active');
    newOrderContainer.style.display = 'none'
    dailyOrders.style.display = 'none'
    scheduleOrders.style.display = 'none'
    historyContainer.style.display = 'block';
    historyContainerHead.style.display = 'none';
})

aiOrderBtn.addEventListener('click',()=>{
    newOrderForm.style.display = 'none';
    aiOrderform.style.display = 'block';
    goBackToNewOrderFormBtn.style.display = 'block';
    aiOrderBtn.querySelector('.process').textContent = 'Using ai';
})

goBackToNewOrderFormBtn.addEventListener('click',()=>{
    newOrderForm.style.display = 'block';
    aiOrderform.style.display = 'none';
    goBackToNewOrderFormBtn.style.display = 'none';
    aiOrderBtn.querySelector('.process').textContent = 'Use ai?';
})


function updateBackground() {
    const body = document.body;
    const currentTime = new Date().getHours();

    // Define daytime and nighttime thresholds (you can adjust these)
    const dayStart = 7; // 7 AM
    const nightStart = 19; // 7 PM

    // Set background color based on current time
    if (currentTime >= dayStart && currentTime < nightStart) {
      body.style.backgroundColor = 'white'; // Daytime color
      document.querySelector('.logo').style.backgroundColor = 'white';
      document.querySelector('.logo').style.color = 'black';
      document.querySelectorAll('.logo a').forEach(logo=>logo.style.color = 'black');
    } else {
      body.style.backgroundColor = 'black'; // Nighttime color
      body.style.color = 'white'
      document.querySelector('.user-action').style.backgroundColor = 'black';
      document.querySelector('.user-action').style.color = 'white';
      document.querySelectorAll('.user-action a').forEach(logo=>logo.style.color = 'white');

      document.querySelectorAll('select').forEach(select=>{select.style.color = 'white';
      select.style.backgroundColor = 'black'})
      document.querySelectorAll('option').forEach(option=>{option.style.color = 'white'; option.style.backgroundColor = 'black'})
    }
  }

  // Initial call to set background based on the current time
  updateBackground();