const productForm = document.getElementById("productForm");
let id = document.getElementById('productId')
let modificar = document.getElementById('modificar');

modificar.addEventListener('click', () => {
  console.log(id.value)
})


console.log('id antes del click',id)





// const handleSubmit = (evt, form, route) => {

 
//   evt.preventDefault();
//   console.log('despies',id)
//   let formData = new FormData(form);
//   fetch(route, {
//     method: "POST",
//     body: formData,
//   });
// };

// productForm.addEventListener("submit", (e) => {
//   handleSubmit(e, e.target, "api/products");
//   alert("Agregado");
//   productForm.reset();
// });