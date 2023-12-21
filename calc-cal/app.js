// Контроллер хранилища
const StorageCtrl = (function() {
  // Публичные методы
  return {
    storeItem: function(item) {
      let items;
      // Проверяем, есть ли уже что-то в локальном хранилище
      if(localStorage.getItem('items') === null) {
        items = [];
        // Добавляем новый элемент
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else { 
        items = JSON.parse(localStorage.getItem('items'));
        // Добавляем новый элемент
        items.push(item);
        // Снова устанавливаем локальное хранилище
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      // Проверяем, есть ли уже что-то в локальном хранилище
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id) {
          // Удаляем элемент и заменяем его на обновленный
          items.splice(index, 1, updatedItem);
        }
      }); 
      // Снова устанавливаем локальное хранилище
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if(id === item.id) {
        items.splice(index, 1);
        }     
      });
      // Снова устанавливаем локальное хранилище
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();

// Контроллер элементов
const ItemCtrl = (function() {
  // Конструктор элемента
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Структура данных / состояние
  const state = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Публичные методы
  return {
    getItems: function() {
      return state.items;
    },
    addItem: function(name, calories) {

      let ID;
      // Create ID
      if(state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calories = parseInt(calories);

      newItem = new Item(ID, name, calories);

      state.items.push(newItem);

      return newItem;

    },
    getItemById: function(id) {
      let found = null;
      state.items.forEach(function(item){
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      calories = parseInt(calories);

      let found = null;

      state.items.forEach(function(item) {
        if(item.id === state.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      ids = state.items.map(function(item) {
        return item.id;
      });
      const index = ids.indexOf(id);

      state.items.splice(index, 1);
    },
    clearAllItems: function() {
      state.items = [];
    },
    getCurrentItem: function() {
      return state.currentItem;
    },
    setCurrentItem: function(item) {
      state.currentItem = item;
    },
    getTotalCalories: function() {
      let total = 0;
      state.items.forEach(function(item){
        total += item.calories;
      });

      state.totalCalories = total;
      return state.totalCalories;
    },
    logData: function() {
      return state;
    }
  }

})();

// Контроллер пользовательского интерфейса
const UICtrl = (function() {

  // Селекторы пользовательского интерфейса
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // Публичные методы
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} калорий</em>
        <a href="#" class="secondary-content">
          <i class="edit-item material-icons">edit</i>
        </a>
      </li>`;
      });

      // Вставка элементов списка
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      // Показать список
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Создание элемента li
      const li = document.createElement('li');
      // Добавление класса
      li.className = ' collection-item';
      // Добавление ID
      li.id = `item-${item.id}`;
      // Добавление HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} калорий</em>
      <a href="#" class="secondary-content">
        <i class="edit-item material-icons">edit</i>
      </a>`;
      // Вставка элемента
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Преобразование NodeList в массив
      listItems = Array.from(listItems);
      
      // Цикл по элементам списка
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} калорий</em>
          <a href="#" class="secondary-content">
            <i class="edit-item material-icons">edit</i>
          </a>`; 
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Преобразование NodeList в массив
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      });
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline-block';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline-block';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline-block';
      document.querySelector(UISelectors.backBtn).style.display = 'inline-block';
      document.querySelector(UISelectors.addBtn).style.display = 'none'; 
    },
    getSelectors: function() {
      return UISelectors;
    }
  }

})();


// Контроллер приложения
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Загрузка обработчиков событий
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Отключаем отправку при входе
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  // Добавление элемента
  const itemAddSubmit = function(e) {

    const input = UICtrl.getItemInput();    

    if(input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);  
      UICtrl.addListItem(newItem);

      // Получаем общие калории
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      StorageCtrl.storeItem(newItem);

      UICtrl.clearInput();
    }

    e.preventDefault();       
  }

  // Обновление элемента
  const itemUpdateSubmit = function(e) {
    
    const input = UICtrl.getItemInput();

    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    
    UICtrl.updateListItem(updatedItem);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Удаление элемента
  const itemDeleteSubmit = function(e) {
    
    const currentItem = ItemCtrl.getCurrentItem();

    ItemCtrl.deleteItem(currentItem.id);

    UICtrl.deleteListItem(currentItem.id);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    // Скрытие списка, если элементов нет
    if(ItemCtrl.getItems().length === 0) {
      UICtrl.hideList();
    }

    e.preventDefault();
  }

  // Очистка всех элементов
  const clearAllItemsClick = function(e) {
    // Удаление всех элементов из состояния
    ItemCtrl.clearAllItems();

    // Получение общего количества калорий
    const totalCalories = ItemCtrl.getTotalCalories();
    // Добавление общего количества калорий в UI
    UICtrl.showTotalCalories(totalCalories);

    // Скрытие списка
    UICtrl.hideList();

    // Удаление из UI
    UICtrl.removeItems();

    // Очистка элементов из локального хранилища
    StorageCtrl.clearItemsFromStorage();
    
    e.preventDefault();
  }

  // Нажмите на редактирование элемента
  const itemEditClick = function(e) {
    
    if(e.target.classList.contains('edit-item')) {  
      
      const listId = e.target.parentNode.parentNode.id;

      const listIdArr = listId.split('-');  

      const id = parseInt(listIdArr[1]);

      const itemToEdit = ItemCtrl.getItemById(id);
      
      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Публичные методы
  return {
    init: function() {  

      UICtrl.clearEditState();

      const items = ItemCtrl.getItems();

      if(items.length === 0) {
        UICtrl.hideList();       
      } else {
        UICtrl.populateItemList(items); 
      }

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

// Инициализация приложения
App.init();