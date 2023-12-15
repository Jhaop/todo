export const projectMethods = {
    'setProjectTitle': function(name) { this.name = name},
    'getProjectTitle': function() { return this.name },
    'length': function(todos) { return todos.length },
    'addElement': function (collection, todo) { 
            if(collection.length === 0) 
                collection.push(todo);            
            else 
                collection.splice(sortInsert(collection, todo), 0, todo);                  
        },
    'getElementByIndex': function ( index ) { return todos[index] },
    'getElementByTitle': function ( collection, title ) { 
            for ( let i = 0; i < collection.length; i++ )
                if( collection[i].getTitle() === title )
                    return collection[i];
        },
    'getElementIndex': function (collection, title ) { 
            for( let index = 0; index < collection.length; index++ ) {
                if( collection[index].getTitle() === title )
                    return index;
            }
        },
    'showAllElements': function (collection) {
        for ( let i = 0; i < collection.length; i++ )
            console.log(`${i} Title: ${collection[i].title}, Description: ${collection[i].description}, Due date: ${collection[i].dueDate}, Priority: ${collection[i].priority}, Check: ${collection[i].check}`)
        },
    'replaceElement': function (collection, index, todo) {
            collection.splice(index, 1, todo);
        },
    'removeElement': function (collection, index) {
            collection.splice(index, 1);
        }
};

export const todoMethods = {
    'setTitle': function( title ) { this.title = title },
    'getTitle': function () { return this.title },
    'setDescription': function ( description ) { this.description = description },
    'getDescription': function () { return this.description },
    'setDueDate': function ( dueDate ) { this.dueDate = dueDate },
    'getDueDate': function () { return this.dueDate },
    'setPriority': function ( priority ) { this.priority = priority },
    'getPriority': function () { return this.priority },
    'setCheck': function ( check ) { this.check = check },
    'getCheck': function () { return this.check },
    'showAll': function () { return `Title: ${this.title}, Description: ${this.description}, Due date: ${this.dueDate}, Priority: ${this.priority}, Check: ${this.check}` }
}

function sortInsert ( elementsArray, newElement ) {
    if(newElement.getDueDate() !== undefined) {
        let newElementDate = newElement.getDueDate();
        for( let i = 0; i < elementsArray.length; i++) {
            if(elementsArray[i].getDueDate() > newElementDate)
                return i;
        }
    }
    return elementsArray.length;
}

export function addMethods(object, methods) {
    for( let func in methods ) {
        object[ func ] = methods [ func ];
    }
};

export function removeMethods(object, methods) {
    for( let func in methods ) {
        delete object[ func ];
    }
}