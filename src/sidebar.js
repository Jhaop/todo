import './style.css';
import { showProject, showProjectsToDos, showNewProjectForm } from './content.js';
import { projectMethods, todoMethods, addMethods, removeMethods } from './objectsNmethods.js';

export default function Sidebar (sidebar) {
    const title = document.createElement('h3');
    title.classList.add('sidebarTitle');
    title.innerHTML = 'My Projects';
    sidebar.appendChild(title);

    const projectList = document.createElement('ul');
    projectList.classList.add('projectList');
    sidebar.appendChild(projectList);

    const newProjectButton = document.createElement('button');
    newProjectButton.setAttribute('class','button');
    newProjectButton.innerHTML = 'NEW PROJECT';
    newProjectButton.addEventListener('click', () => showNewProjectForm());
    sidebar.appendChild(newProjectButton);
}



export function addProject (project) {
    const ul = document.getElementsByClassName('projectList');
    const listItem = document.createElement('ul');
    const projectButton = document.createElement('button');
    projectButton.classList.add('collapsible');
    projectButton.innerHTML = project.getProjectTitle();

    projectButton.addEventListener('click', () => {
        activateButton(projectButton);
        showProject(project);
        showProjectsToDos(project);
    });
    listItem.appendChild(projectButton);


    listItem.setAttribute('id', project.getProjectTitle());
    listItem.classList.add('subList');

    ul[0].appendChild(listItem);
}

export function removeProjectFromSidebar(projectTitle) {
    const list = document.getElementsByClassName('projectList');
    if(list[0].firstChild) {  
        let child = list[0].firstChild;
        while(child.firstChild.innerHTML !== projectTitle)
            child = child.nextSibling;
        list[0].removeChild(child);
    } 
}

function activateButton (button) {
    const items = document.getElementsByClassName('collapsible');    
    let length = items.length;
    for( let i = 0; i < length; i++) {
        if ( items[i].classList.contains('active') ) {
            items[i].classList.toggle('active');
            button.classList.toggle('active');
            return;
        }
    }
    button.classList.toggle('active');
}



