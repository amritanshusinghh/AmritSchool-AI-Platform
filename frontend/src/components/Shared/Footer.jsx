import React from 'react';
import './Footer.css'; // Import the new CSS file

const Footer = () => {
    // Replace with your actual portfolio or website link
    const portfolioUrl = "https://amritanshusingh.netlify.app/"; 

    return (
        <footer className="footer-container">
            <p>
                © 2026 Developed By{' '}
                <a 
                    href={portfolioUrl} 
                    className="developer-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Amritanshu Singh
                </a>
            </p>
        </footer>
    );
};

export default Footer;