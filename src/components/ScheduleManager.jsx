import React, { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import styles from '../styles';
import StyledButton from './StyledButton';

const ScheduleManager = () => {
    const { schedule, saveSchedule } = useSchedule();
    const [localSchedule, setLocalSchedule] = useState(schedule);
    const [saved, setSaved] = useState(false);

    const handleInputChange = (dayIndex, field, value) => {
        setLocalSchedule(prev => ({
            ...prev,
            [dayIndex]: {
                ...prev[dayIndex],
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        saveSchedule(localSchedule);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };
    
    return (
        <div style={styles.card}>
            <div style={{...styles.input, padding: '1.5rem', border: 'none', height: 'auto', flexDirection: 'column'}}>
                <h3 style={{fontSize: '1.125rem', fontWeight: 500}}>Definir Horários de Funcionamento</h3>
                <p style={{fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem'}}>Marque os dias e horários em que a loja estará aberta para pedidos.</p>
            </div>
            <div style={{borderTop: '1px solid #E5E7EB', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                {Object.values(localSchedule).map((day, index) => (
                    <div key={index} style={{display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
                        <label htmlFor={`check-${index}`} style={{fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <input type="checkbox" id={`check-${index}`} checked={day.open} onChange={(e) => handleInputChange(index, 'open', e.target.checked)} />
                            {day.name}
                        </label>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
                            <input type="time" value={day.start} onChange={(e) => handleInputChange(index, 'start', e.target.value)} disabled={!day.open} style={styles.input} />
                            <span>às</span>
                            <input type="time" value={day.end} onChange={(e) => handleInputChange(index, 'end', e.target.value)} disabled={!day.open} style={styles.input} />
                        </div>
                    </div>
                ))}
            </div>
            <div style={{borderTop: '1px solid #E5E7EB', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem'}}>
                {saved && <span style={{color: '#16A34A', fontSize: '0.875rem'}}>Horários salvos com sucesso!</span>}
                <StyledButton onClick={handleSave}>Salvar Horários</StyledButton>
            </div>
        </div>
    );
};

export default ScheduleManager;
