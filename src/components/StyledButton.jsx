import React, { useState } from 'react';
import styles from '../styles';

const StyledButton = ({ variant = 'primary', children, style, ...props }) => {
    const [isHovered, setIsHovered] = useState(false);
    let variantStyle;
    switch (variant) {
        case 'secondary': variantStyle = styles.buttonSecondary; break;
        case 'destructive': variantStyle = styles.buttonDestructive; break;
        case 'ghost': variantStyle = styles.buttonGhost; break;
        default: variantStyle = styles.buttonPrimary; break;
    }
    const hoverStyles = {
        primary: { backgroundColor: '#C2410C' },
        secondary: { backgroundColor: '#D1D5DB' },
        destructive: { backgroundColor: '#B91C1C' },
        ghost: { backgroundColor: '#F3F4F6' }
    };
    const finalStyle = { ...styles.button, ...variantStyle, ...(isHovered && hoverStyles[variant]), ...style };
    if (props.disabled) {
        finalStyle.opacity = 0.5;
        finalStyle.cursor = 'not-allowed';
    }
    return (
        <button
            style={finalStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {children}
        </button>
    );
};

export default StyledButton;