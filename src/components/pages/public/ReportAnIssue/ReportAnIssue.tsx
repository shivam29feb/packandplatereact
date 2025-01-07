import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import styles from './ReportAnIssue.module.css';

const ReportAnIssue = () => {
    return (
        <div className={styles.reportAnIssueContainer}>
            <PublicNavigation />
            <div className={styles.reportAnIssueFormContainer}>
                <h2>Report an Issue</h2>
                <form>
                    <label>
                        <p>Your Name:</p>
                        <input type="text" name="name" />
                    </label>
                    <label>
                        <p>Your Email:</p>
                        <input type="email" name="email" />
                    </label>
                    <label>
                        <p>Issue:</p>
                        <textarea name="issue" rows={10} cols={30} />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default ReportAnIssue;
