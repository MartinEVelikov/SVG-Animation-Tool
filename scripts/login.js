
const loginRequest = () => {

    let loginData = {
        email: document.querySelector('input[name="email"]').value,
        password: document.querySelector('input[name="password"]').value,
    };

    fetch('./endpoints/session.php', {
        method: 'POST',
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
    .then(() => {
      document.body.appendChild(document.createTextNode('Успешно влязохте в системата. Пренасочване към началната страница...'));
      document.location = './index.html';
    })
    .catch(() => console.log('error'));
}

document.getElementById('login-button').addEventListener('click', loginRequest);
