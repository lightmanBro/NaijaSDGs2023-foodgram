function updateBackground() {
    const body = document.body;
    const currentTime = new Date().getHours();

    // Define daytime and nighttime thresholds (you can adjust these)
    const dayStart = 7; // 7 AM
    const nightStart = 19; // 7 PM

    // Set background color based on current time
    if (currentTime >= dayStart && currentTime < nightStart) {
      body.style.backgroundColor = 'white'; // Daytime color
    } else {
      body.style.backgroundColor = 'black'; // Nighttime color
      body.style.color = 'white'
      document.querySelector('.active').style.borderBottom = '.25rem solid black';
    }
  }

  // Initial call to set background based on the current time
  updateBackground();