import React, { useState, createContext, useContext, useMemo } from 'react';

const ScheduleContext = createContext();

export const useSchedule = () => useContext(ScheduleContext);

export const ScheduleProvider = ({ children }) => {
    const defaultSchedule = {
        0: { name: 'Domingo', open: true, start: '18:00', end: '23:00' },
        1: { name: 'Segunda', open: false, start: '18:00', end: '22:00' },
        2: { name: 'Terça', open: true, start: '18:00', end: '22:00' },
        3: { name: 'Quarta', open: true, start: '18:00', end: '22:00' },
        4: { name: 'Quinta', open: true, start: '18:00', end: '22:00' },
        5: { name: 'Sexta', open: true, start: '18:00', end: '23:00' },
        6: { name: 'Sábado', open: true, start: '18:00', end: '23:00' },
    };

    const [schedule, setSchedule] = useState(() => {
        try {
            const savedSchedule = localStorage.getItem('pizzaria_horario');
            return savedSchedule ? JSON.parse(savedSchedule) : defaultSchedule;
        } catch (error) {
            return defaultSchedule;
        }
    });

    const saveSchedule = (newSchedule) => {
        localStorage.setItem('pizzaria_horario', JSON.stringify(newSchedule));
        setSchedule(newSchedule);
    };

    const { isOpen, message } = useMemo(() => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const todaySchedule = schedule[dayOfWeek];

        if (!todaySchedule || !todaySchedule.open) {
            let nextDayInfo = null;
            for (let i = 1; i <= 7; i++) {
                const nextDay = (dayOfWeek + i) % 7;
                if (schedule[nextDay] && schedule[nextDay].open) {
                    nextDayInfo = schedule[nextDay];
                    break;
                }
            }
            const msg = nextDayInfo ? `Estamos fechados. Abriremos ${nextDayInfo.name} às ${nextDayInfo.start}.` : 'Estamos fechados no momento.';
            return { isOpen: false, message: msg };
        }

        if (currentTime >= todaySchedule.start && currentTime <= todaySchedule.end) {
            return { isOpen: true, message: `Aberto agora! Fechamos às ${todaySchedule.end}.` };
        } else if (currentTime < todaySchedule.start) {
            return { isOpen: false, message: `Estamos fechados. Abriremos hoje às ${todaySchedule.start}.` };
        } else {
            return { isOpen: false, message: 'Já fechamos por hoje. Volte amanhã!' };
        }
    }, [schedule]);

    return (
        <ScheduleContext.Provider value={{ schedule, saveSchedule, isOpen, storeStatusMessage: message }}>
            {children}
        </ScheduleContext.Provider>
    );
};
