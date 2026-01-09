const io = require("socket.io-client");

const SERVER_URL = "http://54.144.33.173:5000";

async function runTest() {
    console.log("Starting Debug Test...");

    // 1. Teacher connects
    const teacherSocket = io(SERVER_URL);
    
    teacherSocket.on('connect', () => console.log('Teacher connected'));
    
    let roomId;
    let roomCode;

    teacherSocket.emit('create_room');
    
    teacherSocket.on('room_created', (room) => {
        console.log('Room Created:', room);
        roomId = room._id;
        roomCode = room.roomCode;

        // 2. Start Poll being active
        console.log('Teacher creating poll...');
        teacherSocket.emit('create_poll', {
            roomId: roomId,
            question: "Debug Question?",
            options: ["A", "B"],
            duration: 60,
            correctOptionIndex: 0
        });
    });

    teacherSocket.on('poll_started', (poll) => {
        console.log('Poll Started:', poll._id);
        
        // 3. Late Student Joins
        console.log('Connecting Late Student...');
        const studentSocket = io(SERVER_URL);
        
        studentSocket.on('connect', () => {
             console.log('Student connected, joining room...');
             studentSocket.emit('join_room', { roomCode, name: "LateJoiner" });
        });

        studentSocket.on('poll_update', (p) => {
            console.log('✅ Student received poll update!', p._id);
            
            // 4. Vote Correctly
            console.log('Student voting for option 0 (Correct)...');
            studentSocket.emit('submit_vote', {
                pollId: p._id,
                optionIndex: 0,
                studentName: "LateJoiner",
                roomId
            });
        });

        studentSocket.on('user_voted', () => {
             console.log('Vote acknowledged. Waiting 2s then ending poll...');
             setTimeout(() => {
                 teacherSocket.emit('end_poll', { pollId: poll._id, roomId });
             }, 2000);
        });
        
        // Listen for leaderboard update on student
        studentSocket.on('leaderboard_update', (lb) => {
            console.log('Received Leaderboard Update:', JSON.stringify(lb, null, 2));
            if (lb.length > 0 && lb[0].score > 0) {
                console.log('✅ Leaderboard score updated correctly!');
            } else {
                console.log('❌ Leaderboard score missing or 0');
            }
             teacherSocket.disconnect();
             studentSocket.disconnect();
             process.exit(0);
        });
    });
}

runTest();
