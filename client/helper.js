/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('appMessage').classList.remove('hidden');
  document.getElementById('successMessage').classList.add('hidden');
};

const handleSuccess = (message) => {
  document.getElementById('sucessMessage').textContent = message;
  document.getElementById('successMessage').classList.remove('hidden');
  document.getElementById('appMessage').classList.add('hidden');
  setTimeout(() => {
    document.getElementById('successMessage').classList.add('hidden');
  }, 3000);
}
/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  hideError();
  document.getElementById('successMessage').classList.add('hidden');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  const drawMessageElement = document.getElementById('drawMessage');


  if (drawMessageElement) {
    drawMessageElement.classList.add('hidden');
  }

  if(result.redirect) {
    window.location = result.redirect;
  }

  if(result.error) {
    handleError(result.error);
  }

  if(handler && !result.error && !result.redirect) {
    handler(result);
  }
};

const hideError = () => {
    document.getElementById('appMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    handleSuccess,
    sendPost,
    hideError,
};