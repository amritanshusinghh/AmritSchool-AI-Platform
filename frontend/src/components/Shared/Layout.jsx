import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
    return (
        <>
            <Toaster
                // Change the position to 'top-center'
                position="top-center"
                toastOptions={{
                    // Define default options
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    // Default options for specific types
                    success: {
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
            <Navbar />
            <main style={{ minHeight: '80vh' }}>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;