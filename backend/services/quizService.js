export const generateQuiz = (topic) => {
    return [
        {
            question: `What is ${topic}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: "Option A"
        }
    ];
};
