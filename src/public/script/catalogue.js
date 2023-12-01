
const daily = document.querySelector('#daily')
const weekly = document.querySelector('#weekly');
const past = document.querySelector('#past');
const dailyOrders = document.querySelector('.normal-orders')
const scheduleOrders = document.querySelector('.schedule-orders');
const historyContainer = document.querySelector('.right-container');
const historyContainerHead = document.querySelector('.right-container-heading');
scheduleOrders.style.display = 'none'

weekly.addEventListener('click',(e)=>{
    daily.classList.remove('active');
    weekly.classList.add('active');
    past.classList.remove('active');
    dailyOrders.style.display = 'none'
    scheduleOrders.style.display = 'block'
    historyContainer.style.display = 'none';
})

daily.addEventListener('click',()=>{
    daily.classList.add('active');
    weekly.classList.remove('active');
    past.classList.remove('active');
    scheduleOrders.style.display = 'none'
    dailyOrders.style.display = 'block'
    historyContainer.style.display = 'none';
})

past.addEventListener('click',()=>{
    past.classList.add('active');
    weekly.classList.remove('active');
    daily.classList.remove('active');
    dailyOrders.style.display = 'none'
    scheduleOrders.style.display = 'none'
    historyContainer.style.display = 'block';
    historyContainerHead.style.display = 'none';
})