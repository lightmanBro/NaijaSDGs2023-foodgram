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