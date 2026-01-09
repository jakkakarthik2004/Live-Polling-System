const { Student } = require("../models/Student");

class StudentService {
    async registerStudent(name, socketId) {
        let student = await Student.findOne({ name });
        if (student) {
            student.socketId = socketId;
            student.isOnline = true;
            student.isKicked = false; // Reset kick status on rejoin
            await student.save();
        } else {
            student = await Student.create({ name, socketId, isOnline: true, isKicked: false });
        }
        return student;
    }

    async setOffline(socketId) {
        await Student.findOneAndUpdate({ socketId }, { isOnline: false });
    }

    async markAsKicked(socketId) {
        await Student.findOneAndUpdate({ socketId }, { isOnline: false, isKicked: true });
    }

    async getOnlineStudents() {
        return Student.find({ isOnline: true }).select('name socketId');
    }

    async updateSocketId(name, socketId) {
        await Student.findOneAndUpdate({ name }, { socketId });
    }
}

const studentService = new StudentService();
module.exports = { studentService };
