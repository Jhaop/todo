export default function sortInsert ( elementsArray, newElement ) {
    if(newElement.getDueDate() !== undefined) {
        let newElementDate = newElement.getDueDate();
        for( let i = 0; i < elementsArray.length; i++) {
            if(elementsArray[i].getDueDate() > newElementDate)
                return i;
        }
    }
    return elementsArray.length;
}

