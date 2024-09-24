document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('searchQuery').value;
    if (!query) {
      alert('Please enter a search term');
      return;
    }
    try {
      // Send a POST request to the Express server
      const response = await fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query}),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Server error');
      }
  
      const images = await response.json();
  
      // Clear the gallery and display the images
      imageGallery.innerHTML = '';
      images.slice(0, 16).forEach((image) => {
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imageGallery.appendChild(imgElement);
      });
    } catch (error) {
      alert('Error fetching images: ' + error.message);
    }
  });
  