 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
  apiKey: "AIzaSyA118tOdrQYBHk2ex8xOSnudzWMLQu-mAc",
  authDomain: "storepage-5eac1.firebaseapp.com",
  databaseURL: "https://storepage-5eac1-default-rtdb.firebaseio.com",
  projectId: "storepage-5eac1",
  storageBucket: "storepage-5eac1.firebasestorage.app",
  messagingSenderId: "491352319641",
  appId: "1:491352319641:web:63c7ef356b1ffff0d2fa08",
  measurementId: "G-RJW5HC2KTD"
};


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  firebase.initializeApp(firebaseConfig);
  var DBref = firebase.database().ref("store");

  if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else {
    ready()
}

async function ready() {
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
      }

      var removeCartItemButtons = document.getElementsByClassName('btn-danger')
      console.log(removeCartItemButtons)
      for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
      }
      var editCartItemButtons = document.getElementsByClassName('btn-edit')
      console.log(editCartItemButtons)
      for (var i = 0; i < editCartItemButtons.length; i++) {
        var button = editCartItemButtons[i]
        button.addEventListener('click', editCartItem)
      }
}
function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var quantity = "1"
    console.log(title, price, quantity)
    alert('Thank you for your purchase')
    fbAddToCartClicked(title, price, quantity);
}
async function removeCartItem(event) {
  console.log('clicked')
  var buttonClicked = event.target
    var cartItem = buttonClicked.parentElement.parentElement
    var cartId = cartItem.getElementsByClassName('cart-item-id')[0].innerText
    var title = cartItem.getElementsByClassName('cart-item-title')[0].innerText
    var price = cartItem.getElementsByClassName('cart-item-price')[0].innerText
  console.log(price)
  buttonClicked.parentElement.parentElement.remove()
  deleteData(cartId);
}
async function editCartItem(event) {
  console.log('clicked')
  var buttonClicked = event.target
    var cartItem = buttonClicked.parentElement.parentElement
    var cartId = cartItem.getElementsByClassName('cart-item-id')[0].innerText
    var title = cartItem.getElementsByClassName('cart-item-title')[0].innerText
    var price = cartItem.getElementsByClassName('cart-item-price')[0].innerText
    var quantity = cartItem.getElementsByClassName('new-quantity')[0].value
  console.log(cartItem.getElementsByClassName('new-quantity')[0].value)
  //buttonClicked.parentElement.parentElement.remove()
  editData(cartId, quantity);
    cartItem.getElementsByClassName('cart-item-quantity')[0].innerText = cartItem.getElementsByClassName('new-quantity')[0].value
}
//add data
const saveData = (qlength, title, price, quantity) => {
  var newPurchase = DBref.push();

  newPurchase.set({
    title: title,
    price: price,
    quantity: quantity
  })
 deleteFromIndexedDB(qlength);
}

//get data

firebase.database().ref().child("store").once("value", function (snapshot) {
  console.log(snapshot.key);
  snapshot.forEach(function(childSnapshot){
    /*
    try{
    const docRef = addDoc(collection(db, "store"), task);
    return {id: docRef.id, ...task}
  }catch(error){
    console.error("error retrieving tasks: ", error);
  }
  */

    var cellNum = childSnapshot.key
    var title = childSnapshot.child("title").val();
    var price = childSnapshot.child("price").val();
    var quantity = childSnapshot.child("quantity").val();
    console.log(cellNum);
    $("#table_body1").append('<tr><td class="cart-item-id">' + cellNum + '</td><td class="cart-item-title">' + title + '</td><td class="cart-item-price">'+ price + '</td><td class="cart-item-quantity">'+ quantity + '</td><td>' + '<button class="btn btn-danger" type="button">REMOVE</button>'+ '</td><td>'  + '<input type="number" class="new-quantity" id="new-quantity" name="new-quantity" min="1" max="100" />' + '</td><td>'  + '<button class="btn btn-edit" type="button">EDIT</button>' + '</td></tr>')
  });
  linkButtons();
});
async function linkButtons(){
      var removeCartItemButtons = document.getElementsByClassName('btn-danger')
      for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
        console.log('success')
      }
      var editCartItemButtons = document.getElementsByClassName('btn-edit')
      for (var i = 0; i < editCartItemButtons.length; i++) {
        var button = editCartItemButtons[i]
        button.addEventListener('click', editCartItem)
        console.log('success')
      }
    }

//delete data
const deleteData = (cartId) => {
  firebase.database().ref('store/' +  cartId).remove();
}
const editData = (cartId, quantity) => {
  var changes = {
    quantity: quantity
  }
  firebase.database().ref('store/' +  cartId).update(changes);
}



//indexeddb

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

const request = indexedDB.open("canvasStore", 1);

request.onerror = function (event) {
  console.error("An error occurred with indexedDB");
  console.error(event)
};

request.onupgradeneeded = function () {
  const db = request.result;
  const store = db.createObjectStore("identity", { keyPath: "id", autoIncrement: true});
  store.createIndex("price_prices", ["price"], { unique: true});
  store.createIndex("price_quantity", ["price", "quantity"], { 
    unique: false,
  });
  store.createIndex("price_quantity_title", ["price", "quantity", "title"], { 
    unique: false,
  });
};

request.onsuccess = function () {
  const db = request.result;
  const transaction = db.transaction("identity", "readwrite");

  const store = transaction.objectStore("identity");
  const priceIndex = store.index("price_prices");
  const priceQuantityIndex = store.index("price_quantity");
  const priceQuantityTitleIndex = store.index("price_quantity_title");

  transaction.oncomplete = function() {
    db.close();
  }
};

async function fbAddToCartClicked(title, price, quantity){
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    const request = indexedDB.open("canvasStore", 1);

    request.onerror = function (event) {
      console.error("An error occurred with indexedDB");
      console.error(event)
    };
    request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore("identity", { keyPath: "id", autoIncrement: true});
      store.createIndex("price_prices", ["price"], { unique: true});
      store.createIndex("price_quantity", ["price", "quantity"], { 
        unique: false,
      });
      store.createIndex("price_quantity_title", ["price", "quantity", "title"], { 
      unique: false,
      });
    };

  request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction("identity", "readwrite");

      const store = transaction.objectStore("identity");
      const priceIndex = store.index("price_prices");
      const priceQuantityIndex = store.index("price_quantity");
      const priceQuantityTitleIndex = store.index("price_quantity_title");


      store.put({id: 1, price: price, quantity: quantity, title: title});

      //store.put({id: 2, price: "temp2", quantity: "temp2", title: "Rome"});

      //store.delete(2);
      const idQuery = store.get(1);
      const lookQuery = store.getAll();
      var qlength = 1;

      lookQuery.onsuccess = function () {
      console.log('lookQuery', lookQuery.result);
      console.log(lookQuery.result.length);
      qlength = lookQuery.result.length + 1;
      console.log(qlength);
      loadIntoDb(qlength, price, quantity, title);
    };
    idQuery.onsuccess = function () {
      console.log('idQuery', idQuery.result);
    };

    function loadIntoDb (qlength, price, quantity, title){
      console.log(qlength);
      store.put({id: qlength, price: price, quantity: quantity, title: title});
    }
    //store.put({id: qlength, price: price, quantity: quantity, title: title});

    transaction.oncomplete = function() {
      db.close();
    }
  saveData(qlength, title, price, quantity);
  };
}

async function deleteFromIndexedDB(qlength){
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    const request = indexedDB.open("canvasStore", 1);

    request.onerror = function (event) {
      console.error("An error occurred with indexedDB");
      console.error(event)
    };
    request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore("identity", { keyPath: "id", autoIncrement: true});
      store.createIndex("price_prices", ["price"], { unique: true});
      store.createIndex("price_quantity", ["price", "quantity"], { 
        unique: false,
      });
      store.createIndex("price_quantity_title", ["price", "quantity", "title"], { 
      unique: false,
      });
    };

  request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction("identity", "readwrite");

      const store = transaction.objectStore("identity");
      const priceIndex = store.index("price_prices");
      const priceQuantityIndex = store.index("price_quantity");
      const priceQuantityTitleIndex = store.index("price_quantity_title");


      store.delete(qlength);

    transaction.oncomplete = function() {
      db.close();
    }
  };
}