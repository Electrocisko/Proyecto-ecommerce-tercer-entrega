

const form = document.getElementById("loginForm");


 const succes = (data) => {
  console.log('data',data)
    if (data.status === 'error') {window.location.assign("/errorlogin");}
    else {
    window.location.assign("/menu");
    }
 }

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  let data = new FormData(form);
  let obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then(json => succes(json))
    .catch((error) => {
      console.log(`Error en peticion login.js fetch: ${error}`);
    });
  form.reset();
});