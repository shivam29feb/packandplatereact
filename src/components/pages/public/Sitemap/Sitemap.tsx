import React from 'react';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import './Sitemap.module.css';

const Sitemap = () => {
    return (
        <div className="sitemap">
            <PublicNavigation />
            <div className="sitemap-content">
                <h1>Sitemap</h1>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/terms-and-conditions">Terms and Conditions</a></li>
                    <li><a href="/report-an-issue">Report an Issue</a></li>
                    <li><a href="/feature-request">Feature Request</a></li>
                    <li><a href="/signup">Signup</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/pricing">Pricing</a></li>
                </ul>
            </div>
            <Footer />
        </div>
    );
};

export default Sitemap;