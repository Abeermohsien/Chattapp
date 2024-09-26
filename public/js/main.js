const chatingForm = document.getElementById('chat-form');
const chatingMessages = document.querySelector('.chat-messages');
const roomsName = document.getElementById('room-name');
const usersList = document.getElementById('users');

// return anme and room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// returning chatroom
socket.emit('joinRoom', { username, room });

// return room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// send from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // go down
  chatingMessages.scrollTop = chatingMessages.scrollHeight;
});

// save message 
chatingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // return massege
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // send message to server
  socket.emit('chatMessage', msg);

  // delete output
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// retrun message to dom
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// get user to dom
function outputRoomName(room) {
  roomsName.innerText = room;
}

// get user to dom
function outputUsers(users) {
  usersList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    usersList.appendChild(li);
  });
}

// leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
