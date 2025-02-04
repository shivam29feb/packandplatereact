import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import styles from './ReportAnIssue.module.css';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';

const ReportAnIssue = () => {
    return (
        <div className={styles['report-an-issue-container']}>
            <PublicNavigation />
            <div className={styles['form-container']}>
                <h5>Report an Issue</h5>
                <form>

                    <div className={styles['report-form-field'] }>
                        <label>
                            Your Name
                        </label>
                        <input type="text" name="name" />
                    </div>
                    <div className={styles['report-form-field']}>
                        <label>
                            Your Email
                        </label>
                        <input type="email" name="email" />
                    </div>
                    <div className={styles['report-form-field']}>
                        <label>
                            Issue
                        </label>
                        <textarea name="issue" rows={10} cols={30} />
                    </div>
                    <button type="submit" className="primary-button">Submit</button>
                </form>
            </div>

            <NewsletterSubscription/>
            <Footer />
        </div>
    );
};

export default ReportAnIssue;
