const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;



const createButton=(classes) => {
    const button = document.createElement('button');
    button.className= classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

const createIcon=(classes) => {
    const icon = document.createElement('i');
    icon.className= classes;
    return icon;
}

const displayAllItems = () => {
    const itemsFromStorage = getItemsFromStorage();
        itemsFromStorage.forEach(item => {
            addItemToDOM(item);
        });
        resetUIState();
}

const addItem =(e) => {
    e.preventDefault();
    const newItem = itemInput.value;
    if(newItem === ''){
        alert('Please add an item');
        return
    }
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if(checkIfItemExists(newItem)){
            alert('This item already exists');
            return;
        }
    }

    addItemToDOM(newItem);
    addItemToStorage(newItem);
    resetUIState();
    itemInput.value = '';
}

const addItemToDOM=(item) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button);
    itemList.appendChild(li);
}

const addItemToStorage = (item) => {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

const getItemsFromStorage = () => {
    let itemsFromStorage;
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

const onClickItem = (e) => {
    if (e.target.parentElement.classList.contains('remove-item')){
        removeItem( e.target.parentElement.parentElement);
        removeItemFromStorage(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);
    }
    }

    const checkIfItemExists = (item) => {
        let itemsFromStorage = getItemsFromStorage();
        return itemsFromStorage.includes(item);
    }

    const setItemToEdit = (item) => {
        isEditMode = true;
        itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
        item.classList.add('edit-mode');
        formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
        formBtn.style.backgroundColor = '#228B22';
        itemInput.value = item.textContent;
        
    }

const removeItem = (item) => {
   if(confirm('Are you sure you want to delete this item?')){
   item.remove();
   removeItemFromStorage(item.textContent);
   resetUIState();
}

}

const removeItemFromStorage = (item) => {
    let itemsFromStorage = getItemsFromStorage();
       itemsFromStorage = itemsFromStorage.filter((i)=>i !== (item));
       //reset to local storage
        localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

const clearItems = () => {
    //itemList.innerHTML = '';
    if(confirm('Are you sure you want to delete this item?')){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
       }
    }

    localStorage.removeItem('items');
    resetUIState();
}


const filterItem = (e) => {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) > -1){
            item.style.display = 'flex';
        }else{
            item.style.display = 'none';
        }
    });

}

const resetUIState = () => {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    if(items.length === 0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }else{
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

const init=() => {

// Event listeners
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItem);
document.addEventListener('DOMContentLoaded',displayAllItems);

resetUIState();

}

init();