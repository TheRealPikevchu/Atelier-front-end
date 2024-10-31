import { getTasksList } from './apicommands.js'

getTasksList().then((tasks) => {
  const totalTaskCount = tasks[0].todolist.length
  let taskDoneCount = 0
  for (let taskID = 0; taskID < tasks[0].todolist.length; taskID++) {
    const task = tasks[0].todolist[taskID]

    if (task.is_complete) {
      taskDoneCount++
    }
  }

  // Bar graph for tasks count display
  const totalValues = [totalTaskCount, totalTaskCount - taskDoneCount, taskDoneCount]
  const totalLabels = ['All tasks', 'Tasks to do', 'Tasks done']

  const totalData = {
    labels: totalLabels,
    datasets: [{
      label: 'Tasks count',
      data: totalValues,
      backgroundColor: [
        'rgb(255, 205, 86)',
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)'
      ]
    }]
  }

  const totalConfig = {
    type: 'bar',
    data: totalData
  }
  const totalChart = new Chart(document.querySelector('#tasks-total-chart'), totalConfig)

  // Doughnut graph for tasks achievement representation
  const values = [(((totalTaskCount - taskDoneCount) / totalTaskCount) * 100), ((taskDoneCount / totalTaskCount) * 100)]
  const labels = ['Tasks to do (%)', 'Tasks done (%)']

  const data = {
    labels: labels,
    datasets: [{
      label: 'Tasks repartition',
      data: values,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)'
      ],
      hoverOffset: 4
    }]
  }

  const config = {
    type: 'doughnut',
    data: data
  }
  const statusChart = new Chart(document.querySelector('#tasks-status-chart'), config)
})
