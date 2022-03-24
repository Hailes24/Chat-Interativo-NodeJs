
var socket = io();


do{
    username = prompt("Entra com o seu nome: ");
}while(!username)

socket.emit("Entrou na conversa", username);