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
async function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var quantity = "1"
    console.log(title, price, quantity)
    alert('Thank you for your purchase')
    saveData(title, price, quantity);
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
const saveData = (title, price, quantity) => {
  var newPurchase = DBref.push();

  newPurchase.set({
    title: title,
    price: price,
    quantity: quantity
  })
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