//create db

const store = window.indexedDB.open("db1", 1);

request.onupgradeneeded = (event) => {
	const db = event.target.result;
	const objectStore = db.createObjectStore("id", { keypath: "id", autoincrement: true})
}