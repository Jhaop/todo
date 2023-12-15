import './style.css';
import { compareAsc, format, parseISO} from 'date-fns';
import Header from './header.js';
import Sidebar from './sidebar.js';
import { addProject } from './sidebar.js';
import Content from './content.js';
import { showProject, showProjectsToDos } from './content.js';
import { projectMethods, todoMethods, addMethods, removeMethods } from './objectsNmethods.js';

const projectsCollection = [];

export default function Home(body) {
    const pageContainer = document.createElement('div');
    pageContainer.classList.add('pageContainer');
    const header = document.createElement('div');
    header.classList.add('header');
    const content = document.createElement('div');
    content.classList.add('content');
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    

    Header(header);
    pageContainer.appendChild(header);
    Sidebar(sidebar);
    pageContainer.appendChild(sidebar);
    Content(content);
    pageContainer.appendChild(content);

    body.appendChild(pageContainer);

    retrieveItems();
   
    if(projectsCollection.length === 0) {
        let firstProject = { name: 'Default', todos: [] };
        
        addMethods(firstProject, projectMethods);
        projectsCollection.push(firstProject);
        storeItems();
    } 

    function newProject (...args) {
        args.forEach(element => {
            projectsCollection.push(element);
        });
    }

    projectsCollection.forEach((project) => {
        addProject(project);
    });

    showProject(projectsCollection[0]);
    showProjectsToDos(projectsCollection[0]);  
}

export function insertNewProject( projectTitle ) {
    if( typeof projectTitle === 'object'){
        projectsCollection.push(projectTitle);
        storeItems();
        return projectTitle;
    }
    else {
        let newProject = { name: projectTitle, todos: [] };
        addMethods(newProject, projectMethods);
        projectsCollection.push(newProject);
        storeItems();
        return newProject;
    }
}

export function getProjectByTitle(projectTitle) {
    let i = 0;
    let length = projectsCollection.length;
    while(( i < length) && ((projectsCollection[i].getProjectTitle()) !== projectTitle )) 
        i++; 
    return projectsCollection[i];
}

export function editProject(projectTitle, projectToDo, newTitle, newDescription, newDueDate, newPriority, newCheck) {  
    let projectIndex = getProjectIndex(projectTitle);
    let project = projectsCollection[projectIndex];
    let todoPosition = project.getElementIndex(projectsCollection[projectIndex].todos, projectToDo.getTitle());
    
    let newToDo = {
            title: newTitle,
            description: newDescription,
            dueDate: newDueDate,
            priority: newPriority,
            check: newCheck
        };

    addMethods(newToDo, todoMethods);

    projectsCollection[projectIndex].removeElement(projectsCollection[projectIndex].todos, todoPosition);
    projectsCollection[projectIndex].addElement(projectsCollection[projectIndex].todos, newToDo);
    storeItems();
}

export function removetoDoFromProject(projectTitle, todoTitle) {
    let i = 0;
    let length = projectsCollection.length;
    while ( i < length && projectsCollection[i].getProjectTitle() !== projectTitle)
        i++;
    let projectPosition = i;
    let todoPosition = projectsCollection[projectPosition].getElementIndex(projectsCollection[projectPosition].todos, todoTitle);

    projectsCollection[projectPosition].removeElement(projectsCollection[projectPosition].todos, todoPosition);
    storeItems();
}

export function getProjectIndex (projectTitle) {
    let length = projectsCollection.length;
    for( let i = 0; i < length; i ++) {
        if ( projectsCollection[i].getProjectTitle() === projectTitle ) 
            return i;
    }
}

export function getToDo (projectIndex, toDoTitle) {
    let project = projectsCollection[projectIndex];
    let toDo = project.getElementByTitle(project.todos, toDoTitle);
    return toDo;
}
export function removeProject (projectTitle) {
    let i = 0;
    while(projectsCollection && projectsCollection[i].getProjectTitle() !== projectTitle)
        i++;
    projectsCollection.splice(i, 1);
    storeItems();
}
export function firstProject() {
    return projectsCollection[0];
}

export function checkUncheck(projectTitle, todoTitle) {
    console.log('todotitle: '+todoTitle);
    console.log('projecttitle '+projectTitle);
    let projectIndex = getProjectIndex(projectTitle);
    let todoIndex = projectsCollection[projectIndex].getElementIndex(projectsCollection[projectIndex].todos, todoTitle);
    console.log('project Index: '+projectIndex);
    console.log('todo Index '+todoIndex);
    console.log(projectsCollection[projectIndex].todos[todoIndex]);
    if(projectsCollection[projectIndex].todos[todoIndex].getCheck(true)) {
        projectsCollection[projectIndex].todos[todoIndex].setCheck(false)
        return;
    }
    projectsCollection[projectIndex].todos[todoIndex].setCheck(true);
    storeItems();
}

export function storeItems() {
    localStorage.clear();
    for (let i = 0; i < projectsCollection.length; i++ ) {
        for (let j = 0; j < projectsCollection[i].todos.length; j++) 
            removeMethods(projectsCollection[i].todos[j], todoMethods);
        removeMethods(projectsCollection[i], projectMethods);
    }

    localStorage.setItem('projects', JSON.stringify(projectsCollection));

    for (let i = 0; i < projectsCollection.length; i++ ) {
        for (let j = 0; j < projectsCollection[i].todos.length; j++) 
            addMethods(projectsCollection[i].todos[j], todoMethods);
        addMethods(projectsCollection[i], projectMethods);
    } 
}
function retrieveItems() {
    if(projectsCollection.length === 0) {   
        let collectionCopy = JSON.parse(localStorage.getItem("projects") || "[]");
        let collectionCopyLength = collectionCopy.length;
        for ( let i = 0; i < collectionCopyLength; i++) {
            projectsCollection.push(collectionCopy[i]);
        }
        for ( let i = 0; i < collectionCopyLength; i++) {
            let todosCounter = projectsCollection[i].todos.length;
            for ( let j = 0; j < todosCounter; j++ )
                addMethods(projectsCollection[i].todos[j], todoMethods);
        addMethods(projectsCollection[i], projectMethods);
        }
    }
}



