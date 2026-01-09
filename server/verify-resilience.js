"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const axios_1 = __importDefault(require("axios"));
const SOCKET_URL = 'http://127.0.0.1:5000';
const API_URL = 'http://127.0.0.1:5000/api';
const teacherSocket = (0, socket_io_client_1.io)(SOCKET_URL);
const studentSocket = (0, socket_io_client_1.io)(SOCKET_URL);
function runTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('--- STARTING RESILIENCE VERIFICATION ---');
        // 1. Create Poll (Teacher)
        console.log('1. Creating Poll via API...');
        const createRes = yield axios_1.default.post(`${API_URL}/polls`, {
            question: 'Integration Test Question?',
            options: ['Yes', 'No'],
            duration: 30
        });
        const pollId = createRes.data._id;
        console.log(`   Poll Created: ${pollId}`);
        // 2. Start Poll (Teacher Socket)
        console.log('2. Starting Poll via Socket...');
        teacherSocket.emit('start_poll', { pollId });
        yield new Promise(resolve => {
            studentSocket.on('poll_started', (poll) => {
                console.log(`   Student received poll_started: ${poll.question}`);
                resolve();
            });
        });
        // 3. Register Student & Vote
        console.log('3. Student Voting...');
        studentSocket.emit('register_student', { name: 'BotStudent' });
        studentSocket.emit('vote', { pollId, studentName: 'BotStudent', optionIndex: 0 });
        yield new Promise(resolve => {
            teacherSocket.on('poll_update', (poll) => {
                if (poll.options[0].votes === 1) {
                    console.log('   Teacher received poll_update with correct vote count.');
                    resolve();
                }
            });
        });
        // 4. Simulate Refresh (Disconnect/Reconnect Student)
        console.log('4. Simulating Student Refresh (Disconnect/Reconnect)...');
        studentSocket.close();
        yield new Promise(r => setTimeout(r, 1000)); // Wait a bit
        const recoveredSocket = (0, socket_io_client_1.io)(SOCKET_URL);
        recoveredSocket.on('connect', () => {
            console.log('   Student Reconnected.');
        });
        yield new Promise(resolve => {
            recoveredSocket.on('poll_update', (poll) => {
                console.log(`   Student Connected & Received State: ${poll.question}`);
                const serverStartedAt = new Date(poll.startedAt).getTime();
                const now = Date.now();
                const elapsed = (now - serverStartedAt) / 1000;
                console.log(`   Time Check: Server says started ${elapsed.toFixed(1)}s ago. Duration: ${poll.duration}`);
                if (poll.options[0].votes === 1 && elapsed > 0) {
                    console.log('✅ SUCCESS: State recovered correctly (Votes & Timer).');
                    resolve();
                }
                else {
                    console.error('❌ FAILURE: State mismatch.');
                }
            });
        });
        console.log('--- TEST COMPLETE ---');
        process.exit(0);
    });
}
runTest().catch(console.error);
