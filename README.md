 # nodejs-socketio-chat-app

Simple chat application built with Node.js and Socket.io.  


# Technology
  - Node and Express for server-side rendering
  - Socket.io for establishing a persistent connection through an Express server
  - Utilities: 
    - Mustache template engine for dynamically serving content
    - Moment.js for formatting timestamp information
    - qs for extracting data from a query string
    - Vanilla JS, CSS and HTML for structuring the application visuals and geolocation

# Features

 Application consists of a landing page in which users can choose their display name and the room they want to be chatting in, and the chat page in which users can chat. Features are following:
 
  - Room system for messaging - only users present in the room can see the messages
  - Users can send basic text messages or their location with separate buttons
  - Sidebar preview of active users and the room name
  - Autoscrolling - if the user is watching the newest message, on the arrival of new messages the screen autoscrolls to the bottom. However, if the user is checking out old messages he won't be autoscrolled on the bottom.
  - Messages are rendered in a standard format which consists of the user name, timestamp and the content of the message
  - When recieving location messages, the message appears as a clickable link which opens a new tab with that location showed on Google Maps
  - If a user tries to set a name which is already in use in the specified room, he will be redirected to the landing page where he must choose another name

# Screenshots

 - Landing page
   
   [![chat-landing.png](https://i.postimg.cc/hGVFMkbX/chat-landing.png)](https://postimg.cc/HJWPkPNm)
   
 - Chat page
 
   [![chat.png](https://i.postimg.cc/K8ZQCd2K/chat.png)](https://postimg.cc/qz583Dg0)
