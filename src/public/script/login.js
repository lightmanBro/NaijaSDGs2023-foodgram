// fetch('http://localhost:3001/posts')
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

const mail= document.querySelector('#email');
const pass= document.querySelector('#password');

const loginForm = document.querySelector('#login-form');
const loginData = new FormData(loginForm)
loginForm.addEventListener('submit',(e)=>{
  const password = pass.value;
  const email= mail.value;
  e.preventDefault();
  setTimeout(() => { window.location.href = 'http://127.0.0.1:5500/src/public/index.html'; }, 2000);
  //   fetch('http://localhost:3001/users/login',{
  //     method:'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password })
  // })
  // .then(res=> res.json())
  // .then(data=>{
  //   setTimeout(() => {

  //     sessionStorage.setItem('userData',JSON.stringify(data))
  //     sessionStorage.getItem('userData')
  //     console.log('userdata ',JSON.stringify(data),localStorage.getItem('userData'));
  //     window.location.href = 'http://127.0.0.1:5500/src/public/index.html';  
  //   }, 1500);
  // })
  // .catch(err=>console.log(err))
  
})




const signUpContainer = document.querySelector('#register-container');
const loginContainer = document.querySelector('#login-container');
const signUpContainerOpen = document.querySelector('.signUp-container-open');
const loginContainerOpen = document.querySelector('.login-container-open')
signUpContainer.style.display = 'none'

signUpContainerOpen.addEventListener('click',()=>{
  loginContainer.style.display = 'none';
  signUpContainer.style.display = 'block';
})

loginContainerOpen.addEventListener('click',()=>{
  signUpContainer.style.display = 'none';
  loginContainer.style.display = 'block';
})