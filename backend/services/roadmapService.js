export const generateRoadmap = (goal) => {
    return [
        { title: `Introduction to ${goal}`, description: "Learn basics", resources: ["https://youtube.com"], status: "pending" },
        { title: `Intermediate ${goal}`, description: "Deep dive", resources: ["https://freecodecamp.org"], status: "pending" }
    ];
};
