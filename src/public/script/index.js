const newPost = document.querySelector('#new-post');
const addPostBtn = document.querySelector('.add');

addPostBtn.addEventListener('click',(e)=>{
    // addPostBtn.style.display = 'none';
    newPost.classList.remove('hidden');
    console.log('button clicked')
    console.log(newPost)
})

document.querySelector('.container-body').addEventListener('click',()=>{
    // document.querySelector('.new-post').style.display = 'none';
    // newPost.style.display = 'none';
    newPost.classList.add('hidden');
    console.log('body clicked')
})