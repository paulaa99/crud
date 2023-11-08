document.addEventListener("DOMContentLoaded", function () {
  const botonGet = document.getElementById("btnGet1");
  const botonPost = document.getElementById("btnPost");
  const botonPut = document.getElementById("btnPut");
  const botonDelete = document.getElementById("btnDelete");
  const resultados = document.getElementById("results");
  const alertError = document.getElementById("alert-error");
  const dataModal = new bootstrap.Modal(document.getElementById("dataModal"));
  const btnSendChanges = document.getElementById("btnSendChanges");
  const inputPostNombre = document.getElementById("inputPostNombre");
  const inputPostApellido = document.getElementById("inputPostApellido");
  
  /*eventos para que se deshabiliten/habiliten los botones según su input */
  function updateBotonPost() {
    const nombreValue = inputPostNombre.value.trim();
    const apellidoValue = inputPostApellido.value.trim();
    botonPost.disabled = nombreValue === "" || apellidoValue === "";
  }
  
  inputPostNombre.addEventListener("input", updateBotonPost);
  inputPostApellido.addEventListener("input", updateBotonPost);

  document.getElementById("inputPutId").addEventListener("input", function () {
    botonPut.disabled = this.value.trim() <= "0";
  });
  
  document.getElementById("inputDelete").addEventListener("input", function () {
    botonDelete.disabled = this.value.trim() <= "0";
  });

  const endpoint = "users";
  let URL = `https://6548151b902874dff3acf84f.mockapi.io/${endpoint}`;

  function ElFetch(URL) {
    fetch(URL)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          if (data.length > 0) {
            mostrarResultados(data);
          }
        } else {
          mostrarResultados([data]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  //Añade los resultados al elemento results
  function mostrarResultados(data) {
  
    if (Array.isArray(data)) {
      resultados.innerHTML = ""; 
  
      data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.textContent = `ID: ${item.id}, Nombre: ${item.name}, Apellido: ${item.lastname}`;
        resultados.appendChild(listItem);
      });
    }
  }
  

  fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      mostrarResultados(data);
    })
    .catch((error) => {
      console.error(error);
    });

 
    botonGet.addEventListener("click", function () {
      const inputID = document.getElementById("inputGet1Id").value;
      const getURL = inputID <= "0" //si el input es menor o igual a 0 (?) devuelve el total de resultados, si es mayor (:), devuelve el resultado del id correspondiente
        ? `https://6548151b902874dff3acf84f.mockapi.io/users`
        : `https://6548151b902874dff3acf84f.mockapi.io/users/${inputID}`;
      ElFetch(getURL);
    });
    
  botonPost.addEventListener("click", function () {
    if (inputPostNombre && inputPostApellido) {
      const postURL = `https://6548151b902874dff3acf84f.mockapi.io/users`;
      const data = {
        name: inputPostNombre.value,
        lastname: inputPostApellido.value,
      };

      fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          ElFetch(URL);
        })
        .catch((error) => {
          console.error(error);
          alertError.classList.remove("fade");
        });
    }
  });

  botonPut.addEventListener("click", function () {
    const inputID = document.getElementById("inputPutId").value;

    if (inputID) {
      const getURL = `https://6548151b902874dff3acf84f.mockapi.io/users/${inputID}`;

      fetch(getURL)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          document.getElementById("inputPutNombre").value = data.name;
          document.getElementById("inputPutApellido").value = data.lastname;
          dataModal.show();
          btnSendChanges.disabled = false;

          btnSendChanges.addEventListener("click", function () {
            const putURL = `https://6548151b902874dff3acf84f.mockapi.io/users/${inputID}`;
            const name = document.getElementById("inputPutNombre").value;
            const lastname = document.getElementById("inputPutApellido").value;
            const data = {
              name: name,
              lastname: lastname,
            };

            fetch(putURL, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
              .then((response) => {
                dataModal.hide();
                ElFetch(URL);
              })
              .catch((error) => {
                console.error(error);
              });
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

  botonDelete.addEventListener("click", function () {
    const inputID = document.getElementById("inputDelete").value;

    if (inputID) {
      const deleteURL = `https://6548151b902874dff3acf84f.mockapi.io/users/${inputID}`;

      fetch(deleteURL, {
        method: "DELETE",
      })
        .then((response) => {
          ElFetch(URL);
        })
        .catch((error) => {
          console.error(error);
          alertError.classList.remove("fade");
        });
    }
  });
  
});
