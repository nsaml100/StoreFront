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

//var username = getElementsByClassName('cusername')[0].value
//var password = getElementsByClassName("cpassword")[0].value
//console.log(username, password)
console.log("hello")

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  firebase.initializeApp(firebaseConfig);
  var DBref = firebase.database().ref("store");
  var DBref2 = firebase.database().ref("users");

  document.getElementsByClassName('create')[0].addEventListener('submit', createClicked)
  document.getElementsByClassName('logins')[0].addEventListener('submit', loginClicked)

//create acct
function createClicked(event) {
    var button = event.target
    var acct = button.parentElement.parentElement
    var username = acct.getElementsByClassName('cusername')[0].value
    var password = acct.getElementsByClassName('cpassword')[0].value
    console.log(username, password);
    alert('account created');
    createAcct(username, password);
}

const createAcct = (username, password) => {
  var newAcct = DBref2.push();

  newAcct.set({
    username: username,
    password: password
  })
}

//login
function loginClicked(event) {
    var button = event.target
    var acct = button.parentElement.parentElement
    var username = acct.getElementsByClassName('username')[0].value
    var password = acct.getElementsByClassName('password')[0].value
    console.log(username, password);
    checkLogin(username, password);
        alert('log in tried');
}
function checkLogin(username, password){
firebase.database().ref().child("users").once("value", function (snapshot) {
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

    var fbusername = childSnapshot.child("username").val();
    var fbpassword = childSnapshot.child("password").val();
    if (fbusername === username){
      if(fbpassword === password){
        localStorage.setItem('key', username);
        const user = localStorage.getItem('key');
        console.log(user);
        alert('log in successfull');
        window.location="index.html"
      }
    }
    });
});
    const user = localStorage.getItem('key');
    console.log(user);

}