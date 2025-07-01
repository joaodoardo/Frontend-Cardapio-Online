import React from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import styles from '../styles';
import { ClockIcon } from './Icons';

const StoreStatusBanner = () => {
    const { isOpen, storeStatusMessage } = useSchedule();
    const bannerStyle = {
        padding: '0.75rem 1rem',
        textAlign: 'center',
        fontWeight: 500,
        color: 'white',
        backgroundColor: isOpen ? '#16A34A' : '#DC2626'
    };
    return (
        <div style={bannerStyle}>
            <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <ClockIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>{storeStatusMessage}</span>
            </div>
        </div>
    );
};

export default StoreStatusBanner;