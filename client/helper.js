/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  const errorContent = document.getElementById('errorMessage');
  if (errorContent) {
    errorContent.textContent = message;
  }

  const statusContainer = document.getElementById('statusMessage');
  if (statusContainer) {
    statusContainer.classList.remove('hidden');
  }
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  const statusContainer = document.getElementById('statusMessage');
  if (statusContainer) {
    statusContainer.classList.add('hidden');
  }

  if (!response.ok) {
    if(result.error) {
    handleError(result.error);
  } else {
    handleError('Request failed with status ' + response.status);
  }
  return;
  }

   if(result.redirect) {
    window.location = result.redirect;
  }

  if(handler) {
    handler(result);
  }
} catch (err) {
  console.error('Network or fetch error', err);
  handleError('An unexpected error occurred. Please try again.');
}
};

const hideError = () => {
  const statusContainer = document.getElementById('statusMessage');
  if (statusContainer) {
    statusContainer.classList.add('hidden');
  }
};

module.exports = {
    handleError,
    sendPost,
    hideError,
};