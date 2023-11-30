fetch('http://localhost:3001/posts')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
