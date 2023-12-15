import './style.css';
import { compareAsc, format, parseISO } from 'date-fns';
import { insertNewProject, editProject, getProjectIndex, getToDo, getProjectByTitle, removetoDoFromProject, removeProject, firstProject, storeItems, checkUncheck } from './home.js';
import { addProject, removeProjectFromSidebar } from './sidebar.js';
import { projectMethods, todoMethods, addMethods, removeMethods } from './objectsNmethods.js';


export default function Content (content) {
    const title = document.createElement('h2');
    title.setAttribute('id', 'contentTitle');
    const removeProjectButton = document.createElement('button');
    removeProjectButton.classList.add('removeProjectButton');
    removeProjectButton.innerHTML = 'DELETE PROJECT';
    

    addListener(removeProjectButton, 'removeProject');

    const projectsContainer = document.createElement('div');
    projectsContainer.setAttribute('id', 'projectsContainer');


    content.appendChild(title);
    content.appendChild(removeProjectButton);
    content.appendChild(projectsContainer);
}

function clearContent (container) {
    while(container.firstChild) {
        container.removeChild(container.lastChild);
    }
}
export function showProject(project) {
    const projectTitle = project.getProjectTitle();
    const title = document.getElementById('contentTitle');
    title.innerHTML = projectTitle;

}

export function showProjectsToDos(project) {
    const elements = project.todos;
    const projectsContainer = document.getElementById('projectsContainer');
    if(projectsContainer.firstChild) 
        clearContent(projectsContainer);   
    elements.forEach(todo => {
        const toDoContainer = document.createElement('div');
        toDoContainer.classList.add('toDoContainer');
        toDoContainer.classList.add(priorityColorAssigner(todo.getPriority()));
        const title = document.createElement('h4');
        title.classList.add('toDoTitle');
        const dueDate = document.createElement('p');
        dueDate.classList.add('toDoDueDate');
        const priority = document.createElement('p');
        priority.classList.add('toDoPriority');

        const editBtn = document.createElement('button');
        const doneBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        const expandBtn = document.createElement('button');

        editBtn.classList.add('toDoButton', 'editButton');
        doneBtn.classList.add('toDoButton', 'doneButton');
        deleteBtn.classList.add('toDoButton', 'deleteButton');
        expandBtn.classList.add('toDoButton', 'expandButton');

        addListener(editBtn, 'edit');
        addListener(doneBtn, 'done');
        addListener(deleteBtn, 'delete');
        addListener(expandBtn, 'expand');

        title.innerHTML = todo.getTitle();
        let date = format(new Date(todo.getDueDate()), 'EEEE dd/MM/yyyy HH:mm');
        dueDate.innerHTML = (date);
        priority.innerHTML = todo.getPriority();

        toDoContainer.appendChild(title);
        toDoContainer.appendChild(dueDate);
        toDoContainer.appendChild(priority);
        toDoContainer.appendChild(expandBtn);
        toDoContainer.appendChild(editBtn);
        toDoContainer.appendChild(doneBtn);
        toDoContainer.appendChild(deleteBtn);

        projectsContainer.appendChild(toDoContainer);
    });   
    const newToDoButton = document.createElement('button');
    newToDoButton.classList.add('button', 'newToDoButton');
    newToDoButton.innerHTML = 'New To Do!';
    newToDoButton.addEventListener('click', () => {
        showNewToDoForm(project);
    });

    projectsContainer.appendChild(newToDoButton);
}

function showNewToDoForm(project) {
    if(document.getElementsByClassName('form').length !== 0)
        return;
    const newToDoForm = document.createElement('div');
    newToDoForm.setAttribute('id', 'newToDoForm');
    newToDoForm.classList.add('form');
    const toDoTitleLabel = document.createElement('label');
    toDoTitleLabel.innerHTML = 'Title';
    const toDoTitleInput = document.createElement('input');
    toDoTitleInput.setAttribute('type', 'text');
    const toDoDescriptionLabel = document.createElement('label');
    toDoDescriptionLabel.innerHTML = 'Description';
    const toDoDescriptionInput = document.createElement('textarea');
    const toDoDueDateLabel = document.createElement('label');
    toDoDueDateLabel.innerHTML = 'Due Date';
    const toDoDueDateInput = document.createElement('input');
    toDoDueDateInput.setAttribute('type', 'datetime-local');
    toDoDueDateInput.setAttribute('min', Date.now())

    const toDoPriorityLabel = document.createElement('label');
    toDoPriorityLabel.innerHTML = 'Priority';
    const toDoPriorityInput = document.createElement('select');
    const priorityOption1 = document.createElement('option');
    const priorityOption2 = document.createElement('option');
    const priorityOption3 = document.createElement('option');
    priorityOption1.innerHTML = 'Low';
    priorityOption2.innerHTML = 'Medium';
    priorityOption3.innerHTML = 'High';
    toDoPriorityInput.appendChild(priorityOption1);
    toDoPriorityInput.appendChild(priorityOption2);
    toDoPriorityInput.appendChild(priorityOption3);



    const toDoCreate = document.createElement('button');
    toDoCreate.classList.add('newToDoButton', 'newToDoDone');
    toDoCreate.innerHTML = 'Done';
    toDoCreate.addEventListener('click', () => {
        if(toDoTitleInput.value !== '' && toDoDueDateInput.value !== '' && toDoPriorityInput.value !== ''){
            const newTodo = {
                title: toDoTitleInput.value,
                description: toDoDescriptionInput.value,
                dueDate: new Date(toDoDueDateInput.value),
                priority: toDoPriorityInput.value,
                check: false
            };
            addMethods(newTodo, todoMethods);
            project.addElement(project.todos, newTodo);
            storeItems();
            showProjectsToDos(project);
            removeForm('newToDoForm');
        }
    });

    const toDoCancel = document.createElement('button');
    toDoCancel.classList.add('newToDoButton', 'newToDoCancel');
    toDoCancel.innerHTML = 'Cancel';
    toDoCancel.addEventListener('click', () => removeForm('newToDoForm'));


    newToDoForm.appendChild(toDoTitleLabel);
    newToDoForm.appendChild(toDoTitleInput);
    newToDoForm.appendChild(toDoDescriptionLabel);
    newToDoForm.appendChild(toDoDescriptionInput);
    newToDoForm.appendChild(toDoDueDateLabel);
    newToDoForm.appendChild(toDoDueDateInput);
    newToDoForm.appendChild(toDoPriorityLabel);
    newToDoForm.appendChild(toDoPriorityInput);
    newToDoForm.appendChild(toDoCreate);
    newToDoForm.appendChild(toDoCancel);
    const content = document.getElementsByClassName('content');
    content[0].appendChild(newToDoForm);

}

export function showNewProjectForm() {
    if(document.getElementsByClassName('form').length !== 0) 
        return;
    const newProjectForm = document.createElement('div');
    newProjectForm.setAttribute('id', 'newProjectForm');
    newProjectForm.classList.add('form');
    
    const newProjectTextLabel = document.createElement('label');
    newProjectTextLabel.innerHTML = 'Project name';
    const newProjectTextInput = document.createElement('input');
    newProjectTextInput.setAttribute('type', 'text');
    const newProjectButton = document.createElement('button');
    newProjectButton.innerHTML = 'Create';
    newProjectButton.addEventListener('click', () => {
        if(newProjectTextInput.value === '') 
            return;      
        addProject(insertNewProject( newProjectTextInput.value ));
        removeForm('newProjectForm');
    });
    const newProjectCancelButton = document.createElement('button');
    newProjectCancelButton.innerHTML = 'Cancel';
    newProjectCancelButton.addEventListener('click', () => removeForm('newProjectForm'));

    newProjectForm.appendChild(newProjectTextLabel);
    newProjectForm.appendChild(newProjectTextInput);
    newProjectForm.appendChild(newProjectButton);
    newProjectForm.appendChild(newProjectCancelButton);

    const content = document.getElementsByClassName('content');
    content[0].appendChild(newProjectForm);
}

function removeForm(formName) {
    const form = document.getElementById( formName );
    form.remove();
}

function priorityColorAssigner(priority) {
    if ( priority === 'Low') {
        return 'lowPriority';
    } else if ( priority === 'Medium') 
        return 'mediumPriority';
        else return 'highPriority';
}

function addListener(button, purpose) {
    switch( purpose ) {
        case 'edit':
            button.addEventListener('click', () => {
                editToDoPrompt(button);
            });
            break;
        case 'done':
            button.addEventListener('click', () => {
                button.parentElement.classList.toggle('tick');
                const todoTitle = searchToDoTitle(button);
                const todoProject = searchToDoProjectTitle(button);
                checkUncheck(todoProject, todoTitle);
            });
            break;
        case 'delete':
            button.addEventListener('click', () => {
                const todoTitle = searchToDoTitle(button);
                const todoProject = searchToDoProjectTitle(button);

                removetoDoFromProject(todoProject, todoTitle);
                showProjectsToDos(getProjectByTitle(todoProject));
            });
            break;
        case 'expand':
            button.addEventListener('click', () => {
                fullSizeToDo(button);
            });
            break;
        case 'removeProject':
            button.addEventListener('click', () => {
                const projectToRemove = button.previousElementSibling.innerHTML;
                if(projectToRemove !== 'Default') {
                    removeProjectFromSidebar(projectToRemove);
                    removeProject(projectToRemove);
                    const project = firstProject();          
                    showProject(project);
                    showProjectsToDos(project);
                }
            });
            break;
    }
}

function editToDoPrompt (button) {
    if(document.getElementsByClassName('form').length !== 0)
    return;
    const todoTitle = searchToDoTitle(button);
    const todoProject = searchToDoProjectTitle(button);
    const projectIndex = getProjectIndex(todoProject);
    const todo = getToDo(projectIndex, todoTitle);

    const fullSizeToDoPrompt = document.createElement('div');
    fullSizeToDoPrompt.setAttribute('id', 'fullSizeToDoPrompt');
    fullSizeToDoPrompt.classList.add('form');

    const toDoTitleLabel = document.createElement('label');
    toDoTitleLabel.innerHTML = 'Title';
    const toDoTitleInput = document.createElement('input');
    toDoTitleInput.setAttribute('type', 'text');
    toDoTitleInput.value = todo.getTitle();
    const toDoDescriptionLabel = document.createElement('label');
    toDoDescriptionLabel.innerHTML = 'Description';
    const toDoDescriptionInput = document.createElement('textarea');
    toDoDescriptionInput.value = todo.getDescription();
    const toDoDueDateLabel = document.createElement('label');
    toDoDueDateLabel.innerHTML = 'Due Date';
    const toDoDueDateInput = document.createElement('input');
    toDoDueDateInput.setAttribute('type', 'datetime-local');
    toDoDueDateInput.value = new Date(todo.getDueDate());

    const toDoPriorityLabel = document.createElement('label');
    toDoPriorityLabel.innerHTML = 'Priority';
    const toDoPriorityInput = document.createElement('select');
    const priorityOption1 = document.createElement('option');
    const priorityOption2 = document.createElement('option');
    const priorityOption3 = document.createElement('option');

    priorityOption1.innerHTML = 'Low';
    priorityOption2.innerHTML = 'Medium';
    priorityOption3.innerHTML = 'High';

    const selectedPriority = todo.getPriority();
    
    switch(selectedPriority) {
        case 'Low':
            priorityOption1.setAttribute('selected', 'true');
            break;
        case 'Medium':
            priorityOption2.setAttribute('selected', 'true');
            break;
        case 'High':
            priorityOption3.setAttribute('selected', 'true');
            break;
    }

    toDoPriorityInput.appendChild(priorityOption1);
    toDoPriorityInput.appendChild(priorityOption2);
    toDoPriorityInput.appendChild(priorityOption3);

    const applyChanges = document.createElement('button');
    applyChanges.innerHTML = 'Apply';
    applyChanges.addEventListener('click', () => {
        if(toDoTitleInput.value !== '' && toDoDueDateInput.value !== '' && toDoPriorityInput.value !== '') {
            editProject(todoProject, todo, toDoTitleInput.value, toDoDescriptionInput.value, new Date(toDoDueDateInput.value), toDoPriorityInput.value, false);
            removeForm('fullSizeToDoPrompt');
            showProjectsToDos(getProjectByTitle(todoProject));
        }
    });
    const cancelChanges = document.createElement('button');
    cancelChanges.innerHTML = 'Cancel';
    cancelChanges.addEventListener('click', () => removeForm('fullSizeToDoPrompt'))

    fullSizeToDoPrompt.appendChild(toDoTitleLabel);
    fullSizeToDoPrompt.appendChild(toDoTitleInput);
    fullSizeToDoPrompt.appendChild(toDoDescriptionLabel);
    fullSizeToDoPrompt.appendChild(toDoDescriptionInput);
    fullSizeToDoPrompt.appendChild(toDoDueDateLabel);
    fullSizeToDoPrompt.appendChild(toDoDueDateInput);
    fullSizeToDoPrompt.appendChild(toDoPriorityLabel);
    fullSizeToDoPrompt.appendChild(toDoPriorityInput);
    fullSizeToDoPrompt.appendChild(applyChanges);
    fullSizeToDoPrompt.appendChild(cancelChanges);

    const content = document.getElementsByClassName('content');
    content[0].appendChild(fullSizeToDoPrompt);
    
}

function fullSizeToDo (button) {
    if(document.getElementsByClassName('form').length !== 0)
        return;
    const todoTitle = searchToDoTitle(button);
    const todoProject = searchToDoProjectTitle(button);
    const projectIndex = getProjectIndex(todoProject);
    const todo = getToDo(projectIndex, todoTitle);

    const fullSizeToDoPrompt = document.createElement('div');
    fullSizeToDoPrompt.setAttribute('id', 'fullSizeToDoPrompt');
    fullSizeToDoPrompt.classList.add('form');

    const toDoTitle = document.createElement('h2');
    toDoTitle.innerHTML = todo.getTitle();
    const toDoDescription = document.createElement('p');
    toDoDescription.innerHTML = todo.getDescription();
    const toDoDueDate = document.createElement('p');
    toDoDueDate.innerHTML = todo.getDueDate();
    const toDoPriority = document.createElement('p');
    toDoPriority.innerHTML = todo.getPriority();
    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.classList.add('xButton');
    closeButton.addEventListener('click', () => removeForm('fullSizeToDoPrompt'));

    fullSizeToDoPrompt.appendChild(toDoTitle);
    fullSizeToDoPrompt.appendChild(toDoDescription);
    fullSizeToDoPrompt.appendChild(toDoDueDate);
    fullSizeToDoPrompt.appendChild(toDoPriority);
    fullSizeToDoPrompt.appendChild(closeButton);

    const content = document.getElementsByClassName('content');
    content[0].appendChild(fullSizeToDoPrompt);
}

function searchToDoTitle(button) {
    let placeholder = button.previousElementSibling;
    while(placeholder) {
        if(placeholder.classList.contains('toDoTitle')) {
            return placeholder.innerHTML;
        }
        placeholder = placeholder.previousElementSibling;
    }
}

function searchToDoProjectTitle(button) {
    let sibling = button.parentElement.parentElement;
    while (sibling.id !== 'contentTitle') {
        sibling = sibling.previousElementSibling;
    }
    return sibling.innerHTML;
}