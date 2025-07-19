import { generateRoadmap } from "../services/roadmapService.js";

export const getRoadmap = async (req, res) => {
    const { goal } = req.body;
    const roadmap = generateRoadmap(goal);
    res.json(roadmap);
};
