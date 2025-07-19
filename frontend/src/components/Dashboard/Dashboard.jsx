import React from "react";
import Layout from "../Shared/Layout";
import StatsCard from "./StatsCard";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <Layout>
      <div className="container">
        <h1>📊 Dashboard</h1>
        <div className="dashboard-grid">
          <StatsCard
            title="AI Assistant"
            description="Interact with AI Assistant"
            link="/ai"
            icon="🤖"
          />
          <StatsCard
            title="Chat Room"
            description="Join real-time chat"
            link="/chat"
            icon="💬"
          />
          <StatsCard
            title="Study Room"
            description="Live group study"
            link="/study-room"
            icon="📝"
          />
          <StatsCard
            title="Roadmap Builder"
            description="Get course roadmap"
            link="/roadmap"
            icon="🗺️"
          />

          <StatsCard
            title="AI Quiz Generator"
            description="Test your knowledge"
            link="/quiz"
            icon="🧠"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
