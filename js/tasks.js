import { getTasksList, constructTaskURL } from './apicommands.js'
import { stringToDynamicColor } from './dynamicColors.js'

const taskBoardTodo = document.getElementById('task-board__todo')
const taskBoardDone = document.getElementById('task-board__done')

const addNewTaskButton = document.getElementById('add-new-task-button')
addNewTaskButton.addEventListener('click', (event) => {
  window.location.href = 'task.html'
})

getTasksList().then((tasks) => {
  let taskTags

  tasks[0].todolist.forEach(task => {
    const taskCard = createTaskCard(task.id, task.text, task.Tags)
    task.is_complete ? taskBoardDone.appendChild(taskCard) : taskBoardTodo.appendChild(taskCard)

    task.Tags.forEach(tag => {
      if (!taskTags?.includes(tag)) {
        if (taskTags !== null && taskTags !== undefined) {
          taskTags.push(tag)
        } else {
          taskTags = [tag]
        }
      }
    })
  })

  window.localStorage.setItem('existing-tags', JSON.stringify(taskTags))
})

function createTaskCard (id, text, tags) {
  const taskCard = document.createElement('div')
  taskCard.classList.add('task-card')

  const taskTopSection = document.createElement('div')
  taskTopSection.classList.add('d-flex', 'flex-row', 'justify-content-between', 'align-items-center')
  taskCard.appendChild(taskTopSection)

  const taskId = document.createElement('h6')
  taskId.classList.add('task-card__id')
  taskId.textContent = id
  taskTopSection.appendChild(taskId)

  const taskEdit = document.createElement('a')
  taskEdit.classList.add('task-card__edit', 'unselectable')
  taskEdit.textContent = 'details'
  taskEdit.href = constructTaskURL(id)
  taskTopSection.appendChild(taskEdit)

  const taskTitle = document.createElement('h6')
  taskTitle.classList.add('task-card__title')

  if (text) {
    taskTitle.textContent = text
  }
  taskCard.appendChild(taskTitle)

  const taskTagsSection = document.createElement('div')
  taskTagsSection.classList.add('task-card__tags')

  if (tags) {
    tags.forEach(tag => {
      const taskTag = document.createElement('p')
      taskTag.classList.add('tag')
      taskTag.textContent = tag
      taskTag.style.background = stringToDynamicColor(tag)
      taskTagsSection.appendChild(taskTag)
    })
    taskCard.appendChild(taskTagsSection)
  }

  return taskCard
}
