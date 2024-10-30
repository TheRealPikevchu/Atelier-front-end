// Retrieve username inputfield
const usernamefield = document.getElementById('prenom')

const usernamekey = 'username'

// Setting regex for a string with at least a alphabetic character, upper or lower case
const usernameregex = /[a-zA-Z_]/gm
const usernamevalidator = new RegExp(usernameregex)

// Retrieve username from localStorage
let username = window.localStorage.getItem(usernamekey)
if (username !== null) {
  usernamefield.value = username
}

// If the username is invalid, field is red
usernamefield.addEventListener('invalid', (event) => {
  usernamefield.classList.add('validation-error')
})
usernamefield.addEventListener('valid', (event) => {
  usernamefield.classList.remove('validation-error')
})

// When sumbitting the form, check if the username is valid, and store it to local storage
document.getElementById('form').addEventListener('submit', (event) => {
  event.preventDefault()
  username = usernamefield.value

  if (username !== null && usernamevalidator.exec(username) !== null) {
    window.localStorage.setItem(usernamekey, username)
    window.location.href = 'tasks.html'
  }
})
