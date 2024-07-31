Live Streaming Application
This project is a live streaming application built using React for the frontend and Node.js with Socket.IO for real-time communication. Users can start and stop live video streams, send messages in a live chat, and see the number of live viewers.

Table of Contents
Live Streaming Application
Table of Contents
Features
Prerequisites
Installation
Running the Application
API Usage
Screenshots
License
Contributing
Acknowledgements
Features
Start and stop live video streaming
Real-time chat during live streams
Emoji support in chat
Display the number of live viewers
User authentication
Prerequisites
Node.js (version 14.x or higher)
npm or yarn
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/live-streaming-app.git
cd live-streaming-app
Install server dependencies:

bash
Copy code
cd server
npm install
Install client dependencies:

bash
Copy code
cd ../client
npm install
Running the Application
Server
Navigate to the server directory:

bash
Copy code
cd server
Create a .env file and configure your environment variables:

plaintext
Copy code
PORT=5000
JWT_SECRET=your_jwt_secret
Start the server:

bash
Copy code
npm start
Client
Navigate to the client directory:

bash
Copy code
cd ../client
Create a .env file and configure your environment variables:

plaintext
Copy code
REACT_APP_API_URL=http://localhost:5000
Start the client:

bash
Copy code
npm start
Open your browser and navigate to http://localhost:3000.

API Usage
Authentication
Login
Endpoint: POST /api/auth/login

Body:

json
Copy code
{
  "email": "user@example.com",
  "password": "yourpassword"
}
Response:

json
Copy code
{
  "token": "your_jwt_token"
}
Live Stream
Start Streaming
Endpoint: POST /api/stream/start

Headers:

json
Copy code
{
  "Authorization": "Bearer your_jwt_token"
}
Response:

json
Copy code
{
  "message": "Streaming started"
}
Stop Streaming
Endpoint: POST /api/stream/stop

Headers:

json
Copy code
{
  "Authorization": "Bearer your_jwt_token"
}
Response:

json
Copy code
{
  "message": "Streaming stopped"
}
Chat
Send Message
Endpoint: POST /api/chat/send

Headers:

json
Copy code
{
  "Authorization": "Bearer your_jwt_token"
}
Body:

json
Copy code
{
  "message": "Hello, world!"
}
Response:

json
Copy code
{
  "message": "Message sent"
}
Screenshots


License
This project is licensed under the MIT License. See the LICENSE file for details.

Contributing
Contributions are welcome! Please open an issue or submit a pull request.

Acknowledgements
React
Socket.IO
Node.js
Emoji Picker
