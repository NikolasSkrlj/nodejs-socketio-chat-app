const socket = io(); // ovo mozemo zbog script taga i omogucuje konekciju

const p1 = document.querySelector("p");
const p2 = document.querySelector("#message");
const button = document.querySelector("#submitBtn");
const locationButton = document.querySelector("#location");
const messages = document.querySelector("#messages");

const toggleButton = document.querySelector("#toggle");
const sidebar = document.querySelector("#sidebar");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  //new message element
  const newMessage = messages.lastElementChild;

  //height of the new message
  const newMessageStyles = getComputedStyle(newMessage); // s ovime dobivamo style elementa
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
  //offsetHeight daju visinu contenta u containeru

  //visible height
  const visibleHeight = messages.offsetHeight; // visina containera koja se vidi

  //height of the messages container
  const containerHeight = messages.scrollHeight; // cijela visina containera

  //how far have i scrolled
  const scrollOffset = messages.scrollTop + visibleHeight; // koliko od vrha smo udaljeni

  //Ako smo na dnu prije pojave nove poruke skrolati ce se, a ako je skrol negdje gore necemo
  // to radimo da ako korisnik cita stare poruke i dodje nova poruka da ga se ne scrolla na dno
  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight; // ovo skrola do dna
  }
};
// pomocu on se postavi listener koji slusa na event od servera recieve message i izvrsava callback funkciju u kojoj se moze pristupiti
// poslanim podacima
socket.on("recieveMessage", (message) => {
  //console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (location) => {
  // console.log(location);
  const html = Mustache.render(locationTemplate, {
    username: location.username,
    location: location.location,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  //console.log(room, users);
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

const form = document.querySelector("form");
const fieldset = document.querySelector("#toggle");
const messageInput = document.querySelector("#textMessage");

//pomocu socket emita salje se event serveru i handler na serveru izvrsava callback funkciju kao i klijent ovdje
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = form.message.value;
  if (message) {
    button.setAttribute("disabled", "disabled");

    socket.emit("sendMessage", message, (error) => {
      //treci argument je funkcija koja se okida kad je event acknowledged tj kad je stigao do servera
      button.removeAttribute("disabled");
      form.reset();
      messageInput.focus();

      if (error) {
        return console.log(error); // message se salje kroz callback funkciju za acknowledge na serveru
      }
      console.log("Message delivered");
      //form.message.focus();
    });
  }
});

// to treba popravit ne radi kako treba jer se mijesaju media queryiji i manualno podesavanje
toggleButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (sidebar.style.marginLeft) {
    sidebar.style.marginLeft = "-225px";
  } else {
    sidebar.style.marginLeft = 0;
  }
});

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your browser doesn't support this feature!");
  }
  locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      },
      () => {
        console.log("Location shared!");
        locationButton.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
