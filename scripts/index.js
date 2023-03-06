
const loginStatusMethods = {
  checkLoginStatus: () => {

    fetch('./endpoints/session.php')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
    .then(loginStatusMethods.handleLoginStatusResponse)
    .catch(() => {
      console.log('login status check failed');
    });
  },

  handleLoginStatusResponse: loginStatusResponse => {

    if (loginStatusResponse.loginStatus) {
      // logged
      document.querySelectorAll('.logged')
        .forEach(element => element.style="display: flex");

      init();
    } else {
      // not logged
      document.querySelectorAll('.not-logged')
        .forEach(element => element.style="display: flex");
    }
  
  }
};

const logout = () => {

    fetch('./endpoints/session.php', {
      method: 'DELETE'
    })
    .then(() => {
        document.body.appendChild(document.createTextNode('Успешно излизане от системата'));
        document.location.reload();
    })
    .catch(() => console.log('error'));
  
}

document.getElementById('logout-button').addEventListener('click', logout);

loginStatusMethods.checkLoginStatus();
