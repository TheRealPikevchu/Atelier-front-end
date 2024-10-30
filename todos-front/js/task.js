import { getTasksList, postNewTask, getTask, editTask, deleteTask, constructTaskURL } from './apicommands.js'
import { stringToDynamicColor } from './dynamicColors.js'

const possibleStatus = ['To do', 'Done']
const possibleStatusValues = [false, true]

const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')

let taskTags
let isTagFormOpen = false

const taskNameTexts = document.getElementsByClassName('task-name')
const taskForm = document.getElementById('task-form')
const metadataView = document.getElementById('metadata')
const editButton = document.getElementById('edit-button')
const saveButton = document.getElementById('save-button')
const deleteButton = document.getElementById('delete-button')
const taskID = document.getElementById('task-id')
const taskCreationDate = document.getElementById('task-creation-date')
const taskDescription = document.getElementById('task-description')
const taskDescriptionField = document.getElementById('task-description-field')
const taskStatus = document.getElementById('task-status')
const taskTagsHolder = document.getElementById('tags')
const addTagButton = document.getElementById('add-tag-button')
const addTagForm = document.getElementById('add-tag-form')
const tagNameField = document.getElementById('tag-name')
const addTagCancelButton = document.getElementById('tag-cancel-button')

let existingTags = window.localStorage.getItem('existing-tags')

if (existingTags === null) {
  getTasksList().then((tasks) => {
    tasks[0].todolist.forEach(task => {
      task.Tags.forEach(tag => {
        if (!existingTags?.includes(tag)) {
          if (existingTags !== null && existingTags !== undefined) {
            existingTags.push(tag)
          } else {
            existingTags = [tag]
          }
        }
      })
    })
    window.localStorage.setItem('existing-tags', JSON.stringify(existingTags))
  })
}

const tagAutoComplete = new autoComplete({
  placeholder: 'new tag...',
  selector: '#tag-name',
  data: {
    src: JSON.parse(existingTags)
  },
  resultItem: {
    highlight: true
  }
})

tagAutoComplete.input.addEventListener('selection', function (event) {
  const feedback = event.detail
  tagAutoComplete.input.value = feedback.selection.value
  console.log(feedback)
})

taskForm.addEventListener('submit', (event) => {
  event.preventDefault()

  if (validateForm() && !isTagFormOpen) {
    if (id !== null) {
      editCurrentTask()
    } else {
      saveNewTask()
    }
    setEditionMode(false)
  }
})

populateForm()

editButton.addEventListener('click', (event) => {
  setEditionMode(true)
})

addTagButton.addEventListener('click', (event) => {
  if (isTagFormOpen) {
    addTagBehaviour()
  } else {
    addTagForm.classList.remove('d-none')
    isTagFormOpen = true
  }
})

tagNameField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTagBehaviour()
  }
})

addTagCancelButton.addEventListener('click', (event) => {
  isTagFormOpen = false
  tagNameField.value = ''
  addTagForm.classList.add('d-none')
})

function addTagBehaviour () {
  if (tagNameField.value !== null && tagNameField.value.charAt(0 !== ' ')) {
    if (taskTags !== null && taskTags !== undefined) {
      taskTags.push(tagNameField.value)
    } else {
      taskTags = [tagNameField.value]
    }
    tagNameField.value = ''
    populateTags()
  }
  addTagForm.classList.add('d-none')
  isTagFormOpen = false
}

function populateForm () {
  if (id === null) {
    metadataView.classList.add('invisible')

    setEditionMode(true)

    for (let nameFieldIndex = 0; nameFieldIndex < taskNameTexts.length; nameFieldIndex++) {
      taskNameTexts[nameFieldIndex].innerText = 'New task'
    }

    taskStatus.value = 0

    deleteButton.innerText = 'CANCEL'
    deleteButton.addEventListener('click', (event) => {
      window.location.href = 'tasks.html'
    })
  } else {
    getTask(id).then((task) => {
      setEditionMode(false)

      for (let taskNameID = 0; taskNameID < taskNameTexts.length; taskNameID++) {
        taskNameTexts[taskNameID].innerText = 'Task #' + id
      }

      taskID.textContent = id
      taskCreationDate.textContent = task.created_at

      taskDescription.textContent = task.text
      taskDescriptionField.textContent = task.text

      if (task.Tags) {
        taskTags = task.Tags
        populateTags()
      }

      taskStatus.value = possibleStatusValues.indexOf(task.is_complete)
      taskStatus.addEventListener('change', (event) => {
        const task = {
          is_complete: possibleStatusValues[taskStatus.value]
        }
        editTask(id, task)
      })

      deleteButton.addEventListener('click', (event) => {
        deleteTask(id)
        window.location.href = 'tasks.html'
      })
    })
  }
  populateStatus()
}

function populateStatus () {
  const statusSelect = document.getElementById('task-status')
  for (let statusID = 0; statusID < possibleStatus.length; statusID++) {
    const option = document.createElement('option')
    option.value = statusID
    option.text = possibleStatus[statusID]
    statusSelect.appendChild(option)
  }
}

function populateTags () {
  while (taskTagsHolder.firstChild) {
    taskTagsHolder.removeChild(taskTagsHolder.firstChild)
  }

  taskTags.forEach(tag => {
    const taskTag = document.createElement('p')
    taskTag.classList.add('tag')
    taskTag.textContent = tag
    taskTag.style.background = stringToDynamicColor(tag)
    taskTagsHolder.appendChild(taskTag)
  })
}

function saveNewTask () {
  postNewTask(getTaskFromForm()).then((task) => {
    window.location.href = constructTaskURL(task.id)
  })
}

function editCurrentTask () {
  editTask(id, getTaskFromForm()).then((task) => {
    window.location.href = constructTaskURL(task.id)
  })
}

function setEditionMode (mode) {
  if (mode) {
    // Edition is on
    editButton.classList.add('d-none')
    saveButton.classList.remove('d-none')
    taskDescription.classList.add('d-none')
    taskDescriptionField.classList.remove('d-none')
    deleteButton.classList.remove('invisible')
    deleteButton.disabled = false
    addTagButton.classList.add('editable')
  } else {
    // Edition is off
    editButton.classList.remove('d-none')
    saveButton.classList.add('d-none')
    taskDescription.classList.remove('d-none')
    taskDescriptionField.classList.add('d-none')
    deleteButton.classList.add('invisible')
    deleteButton.disabled = true
    addTagButton.classList.remove('editable')
  }
}

function validateForm () {
  if (taskDescriptionField.value === null || taskDescriptionField.length === 0) {
    return false
  }
  return true
}

function getTaskFromForm () {
  return {
    text: taskDescriptionField.value,
    Tags: taskTags,
    is_complete: possibleStatusValues[taskStatus.value]
  }
}
