import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Shared/Layout';
import { isLoggedIn } from '../utils/authUtils'; // Import the authentication check
import './HomePage.css';

const HomePage = () => {
    const loggedIn = isLoggedIn(); // Check if the user is logged in

    return (
        <Layout>
            <div className="hero-section">
                <div className="container">
                    <h1>Welcome to Amrit's School 🚀</h1>
                    <p>Your all-in-one AI-powered learning assistant!</p>
                    {/* Conditionally render the button */}
                    {loggedIn ? (
                        <Link to="/dashboard" className="cta-button">Go to Dashboard</Link>
                    ) : (
                        <Link to="/register" className="cta-button">Get Started for Free</Link>
                    )}
                </div>
            </div>

            {/* --- FEATURES SECTION --- */}
            <section className="features-section">
                <div className="container">
                    <h2>Why Choose Amrit's School?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>🤖 AI Assistant</h3>
                            <p>Get instant help with complex topics, summarize articles, and ask any study-related question.</p>
                        </div>
                        <div className="feature-card">
                            <h3>🗺️ AI Roadmap Generator</h3>
                            <p>Generate personalized learning paths for any subject, from web development to data science.</p>
                        </div>
                        <div className="feature-card">
                            <h3>📝 Collaborative Study Rooms</h3>
                            <p>Join live study sessions with a shared chat, timer, and collaborative tools to stay focused.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS SECTION --- */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2>Get Started in 3 Simple Steps</h2>
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Create Your Account</h3>
                            <p>Sign up for free and set up your profile in just a minute.</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Explore Your Dashboard</h3>
                            <p>Access all the tools like the AI Assistant, Roadmap Builder, and Study Rooms.</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Start Learning</h3>
                            <p>Join a study session, create a learning plan, or get AI-powered help instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS SECTION --- */}
            <section className="testimonials-section">
                <div className="container">
                    <h2>What Our Users Say</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <p>"Amrit's School's AI Assistant is a lifesaver for my computer science homework. The explanations are clear and concise!"</p>
                            <h4>- Harshit, College Student</h4>
                        </div>
                        <div className="testimonial-card">
                            <p>"The roadmap generator gave me a clear path to learn React. I went from novice to building my own project in weeks."</p>
                            <h4>- Prashant, Aspiring Developer</h4>
                        </div>
                        <div className="testimonial-card">
                            <p>"The focused study rooms have been amazing for my productivity. The group timer keeps everyone accountable."</p>
                            <h4>- Amit, AITH Kanpur</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA SECTION --- */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Boost Your Learning?</h2>
                    <p>Join thousands of students and start your journey with Amrit's School today.</p>
                     {/* Conditionally render the final button */}
                    {loggedIn ? (
                        <Link to="/dashboard" className="cta-button">Explore Features</Link>
                    ) : (
                        <Link to="/register" className="cta-button">Sign Up Now</Link>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default HomePage;