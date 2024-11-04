const serverPort = 3000
const localApiAddress = `http://localhost:${serverPort}/` // local for dev
const webApiAddress = 'https://back-atelier-front-end.vercel.app/' // deployement

const headers = {
  'Content-type': 'application/json',
  'Access-Control-Allow-Origin:': webApiAddress
}


const isDevMode = false // true for local server, false for web server
const verbose = false

let apiAddress = isDevMode ? localApiAddress : webApiAddress

export async function getTasksList () {
  return fetch(`${apiAddress}todos'`, {
    method: 'GET',
    headers: headers
  })
    .then((response) => response.json())
    .then((data) => {
      if (verbose) {
        console.log(`Fetched ${data[0].todolist.length} todos.
          \n${JSON.stringify(data[0].todolist)}`)
      }
      return data
    })
    .catch((error) => {
      console.error(`Error fetching the tasks list : ${error}`)
      window.alert(`Error fetching the tasks list : ${error}`)
    })
}

export async function postNewTask (todo) {
  return fetch(`${apiAddress}todos'`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(todo)
  }).then((response) => response.json())
    .then((data) => {
      if (verbose) {
        console.log(`Todo ${data.id} created.
      \n${JSON.stringify(data)}`)
      }
      return data
    })
    .catch((error) => {
      console.error(`Error creating new task : \n${error}`)
      window.alert(`Error creating new task : \n${error}`)
    })
}

export async function getTask (id) {
  return fetch(`${apiAddress}todos/'${id}`, {
    method: 'GET',
    headers: headers
  })
    .then((response) => {
      if (response.status === 404) {
        throw new Error(`The task #${id} you are trying to get does not exist.`, 404)
      } else {
        if (!response.ok) {
          throw new Error(`Can't get task #${id}`)
        }
      }
      return response.json()
    })
    .then((data) => {
      if (verbose) {
        console.log(`Fetched todo #${id}.
      \n${JSON.stringify(data)}`)
      }
      return data
    })
    .catch((error) => {
      console.error(`Error getting task with id ${id} : \n${error}`)
      window.alert(`Error getting task with id ${id} : \n${error}`)
    })
}

export async function editTask (id, todo) {
  return fetch(`${apiAddress}todos/'${id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(todo)
  }).then((response) => {
    if (response.status === 404) {
      throw new Error(`The task #${id} you are trying to update does not exist.`, 404)
    } else {
      if (!response.ok) {
        throw new Error(`Can't edit task #${id}`)
      }
    }
    return response.json()
  })
    .then((data) => {
      if (verbose) {
        console.log(`Todo ${data.id} modifiyed.
      \n${JSON.stringify(data)}`)
      }
      return data
    })
    .catch((error) => {
      console.error(`Error editing task with id ${todo.id} : \n${error}`)
      window.alert(`Error editing task with id ${todo.id} : \n${error}`)
    })
}

export async function deleteTask (id) {
  return fetch(`${apiAddress}todos'/${id}`, {
    method: 'DELETE',
    headers: headers
  }).then((response) => {
    if (response.status === 404) {
      throw new Error(`The task #${id} you are trying to delete does not exist.`)
    } else {
      if (!response.ok) {
        throw new Error(`Can't delete task #${id}`)
      }
      if (verbose) {
        console.log(`Todo #${id} deleted`)
      }
      return true
    }
  }).catch((error) => {
    if (verbose) {
      console.error(`Error deleting task with id ${id} : \n${error}`)
      window.alert(`Error deleting task with id ${id} : \n${error}`)
    }
  })
}

export function constructTaskURL (id) {
  const params = new URLSearchParams()
  params.append('id', id)
  const querystring = params.toString()
  return `task.html?${querystring}`
}
