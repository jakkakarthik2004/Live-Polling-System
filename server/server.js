const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { registerSocketHandlers } = require("./socket/socketHandler");
const { createPoll, getPolls, getPollDetails, getActivePoll, getLatestPoll } = require("./controllers/PollController");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

app.post('/api/polls', createPoll);
app.get('/api/polls', getPolls);
app.get('/api/polls/active/:roomId', getActivePoll);
app.get('/api/polls/last/:roomId', getLatestPoll);
app.get('/api/polls/:id', getPollDetails);

app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running' });
})

registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});