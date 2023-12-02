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