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
// const postId = '6565c213aacd4547026b7e15'
// fetch(`https://localhost:3001/posts/${postId}`)
// .then(res=>res.json())
// .then(data=>console.log(data))
// .catch(err=>console.log(err))


/*Video autoplay*/
const video = document.querySelector('#lazyloader');
let isPlaying = false;

const options = {
    root:null,
    rootMargin:'0px',
    threshold:0.75
}

const playVideoInView = () =>{
    if(document.visibilityState === 'visible'){
        video.src = video.querySelector('source').getAttribute('data-src');
        video.play();
        console.log(document.visibilityState)
    }
};

try {
    const observer = new IntersectionObserver((entries,observer)=>{
    
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                playVideoInView();
                console.log(entry)
            }else if(!entry.isIntersecting){
                video.pause()
                console.log(entry)
            }
        });
    },options);
    
    observer.observe(video);
} catch (error) {
    console.log(error.message)
}

setTimeout(() => {
    console.log(JSON.parse(sessionStorage.getItem('userData'))) 
}, 2000);

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
      document.querySelector('.logo').style.backgroundColor = 'black';
      document.querySelector('.logo').style.color = 'white';
      document.querySelectorAll('.logo a').forEach(logo=>logo.style.color = 'white');
      document.querySelectorAll(' a').forEach(link=>link.style.color = 'white');
      document.querySelector('.add').style.color = 'white'
      document.querySelector('.add').style.backgroundColor = 'black'
    }
  }

  // Initial call to set background based on the current time
  updateBackground();