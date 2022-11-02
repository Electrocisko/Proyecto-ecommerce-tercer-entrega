const userCartId = document.getElementById("userCartId").innerText;
const userName = document.getElementById("userName").innerText;
const userMail = document.getElementById("userEmail").innerText;
const userId = document.getElementById("userId").innerText;
const returnCart = document.getElementById("returnCart");
const sendMail = document.getElementById("sendMail");

let totalPrice = 0;

let texto = `Pedido de ${userName} con email : ${userMail} ID del usuario: ${userId}  ID del carrito: ${userCartId} \n`;
let urlProducts = `/api/carts/${userCartId}/products`;

returnCart.addEventListener("click", () => {
  window.history.back();
});

const inicio = () => {
  window.location.assign("/");
};

fetch(urlProducts)
  .then((response) => response.json())
  .then((data) => {
    data.products.forEach((element) => {
      let container = document.createElement("div");
      container.className = "container";
      container.innerHTML = `<p><strong> ${
        element.product
      } </strong>  Cantidad: ${element.cuantity} Total Pesos: ${
        element.price * element.cuantity
      }</p>`;
      totalPrice = (element.price * element.cuantity) + totalPrice;
      document.body.append(container);
    });

    let showTotalPrice = document.createElement("div");
    showTotalPrice.className = 'container';
    showTotalPrice.innerHTML = `<strong>Precio Total en Pesos $ ${totalPrice}</strong>`


    document.body.append(showTotalPrice)

    let order = {
      user: userName,
      email: userMail,
      id: userId,
      cartId: userCartId,
      Products: data,
    };

    sendMail.addEventListener("click", async () => {
      alert("Pedido enviado");
      fetch("/api/messages/mail", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
           inicio();
        });
    });
  });
