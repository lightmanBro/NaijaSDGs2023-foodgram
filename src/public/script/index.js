const newPost = document.querySelector('#new-post');
const addPostBtn = document.querySelector('.add');

addPostBtn.addEventListener('click',(e)=>{
    newPost.classList.remove('hidden');
    addPostBtn.style.display = 'none'
})

document.querySelector('.container-body').addEventListener('click',()=>{
    newPost.classList.add('hidden');
    addPostBtn.style.display = 'block'
})  

const form = document.querySelector('form');
const formData = new FormData(form)
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log(formData.entries()[0]);
})
const postId = '6565c213aacd4547026b7e15'
fetch(`https://localhost:3001/posts/${postId}`)
.then(res=>res.json())
.then(data=>console.log(data))
.catch(err=>console.log(err))