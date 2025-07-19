export const quizSocketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`Quiz socket connected: ${socket.id}`);

        // Join a quiz session room
        socket.on("joinQuiz", ({ quizRoom }) => {
            socket.join(quizRoom);
            console.log(`User ${socket.id} joined quiz room: ${quizRoom}`);
        });

        // Broadcast quiz question to the room
        socket.on("sendQuestion", ({ quizRoom, question }) => {
            io.to(quizRoom).emit("receiveQuestion", question);
            console.log(`Question sent to room ${quizRoom}`);
        });

        // Receive answer from user and broadcast to room
        socket.on("submitAnswer", ({ quizRoom, answer, userId }) => {
            io.to(quizRoom).emit("receiveAnswer", { answer, userId });
        });

        // Notify room of quiz completion
        socket.on("quizCompleted", ({ quizRoom, userId }) => {
            io.to(quizRoom).emit("quizEnded", { message: `User ${userId} completed the quiz.` });
        });

        socket.on("disconnect", () => {
            console.log(`Quiz socket disconnected: ${socket.id}`);
        });
    });
};
