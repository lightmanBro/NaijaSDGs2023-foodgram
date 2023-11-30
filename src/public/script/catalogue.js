
const daily = document.querySelector('#daily')
const weekly = document.querySelector('#weekly');
const dailyOrders = document.querySelector('.normal-orders')
const scheduleOrders = document.querySelector('.schedule-orders');

scheduleOrders.style.display = 'none'

weekly.addEventListener('click',(e)=>{
    daily.classList.remove('active');
    weekly.classList.add('active');
    dailyOrders.style.display = 'none'
    scheduleOrders.style.display = 'block'
})

daily.addEventListener('click',()=>{
    daily.classList.add('active');
    weekly.classList.remove('active');
    scheduleOrders.style.display = 'none'
    dailyOrders.style.display = 'block'
})