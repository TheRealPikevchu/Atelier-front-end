Project done within the Front end interface programming GDU course. The goal was to create a basic taks management app, communicating with a given API and using a given front-end.

# Files management
```
TODOLIST/
|-- package.json
|-- todos-front/
|   |-- index.html
|   |-- tasks.html
|   |-- task.html
|   |-- statistics.html
|   |-- js/
|   |   |-- apicommands.js
|   |   |-- dynamicColors.js
|   |   |-- index.js
|   |   |-- statistics.js
|   |   |-- tasks.js
|   |   |-- task.js
|-- totolist/
|-- README.md
```

## Index
Index acts as the landing page of the app.
Here one can enter a username, which is saved to localStorage to access the actual app.

## Tasks
Tasks is the taskboard section of the app. In here one can visualize all tasks from the API.
Each task is represented by a card presenting :
- task name
- tags
- access to details
- status (done or to do)
The Insights section is accessible from this page.
This pages relies on two other classes : [apicommands](#apicommands) and [dynamicColors](#dynamiccolors).

## Task
The details of a specific task is presented here, and allow for modifications. There is two types of modification : 
- status
- content
The status can be changes freely.
The content is limited within an edit mode, to prevent freely editing a task. 
In edit mode, one can :
- edit task description
-  add tags
- delete task
When adding a tag, autocompletion is done using [@tarekraafat/autocomplete.js](https://tarekraafat.github.io/autoComplete.js/#/).

## Statistics
This section presents statistics about the tasks, such as the total amount of tasks, and a visualition of done VS todo tasks.
Visualisation is done thanks to [chart.js](https://www.chartjs.org/).

## apicommands
This class manages api calls for the app. API error management is integrated here, and a verbose mode is available for debugging.

## dynamicColors
This class allow for, given a string, returning a color calculated from the string content. This is used to ease tag readability.

# Installation
To properly install the app, please follow these instructions :
1. From a terminal, `npm install` to install all required packages.
2. For development, launch `npm run` to run standard linter.
3. Finally, to start the local API, `cd ./totolist` and then `npm start` from here.