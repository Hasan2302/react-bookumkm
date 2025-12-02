import { useEffect, useState, useRef } from 'react';

export default function MagneticCursor() {
    const cursorRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        const handleElementMouseEnter = (e) => {
            if (e.target.getAttribute('data-magnetic') === 'true' || e.target.closest('[data-magnetic="true"]')) {
                setIsHovering(true);
            }
        };

        const handleElementMouseLeave = (e) => {
            if (e.target.getAttribute('data-magnetic') === 'true' || e.target.closest('[data-magnetic="true"]')) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseleave', handleMouseLeave);
        
        // Add listeners to all magnetic elements
        const magneticElements = document.querySelectorAll('[data-magnetic="true"]');
        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', handleElementMouseEnter);
            el.addEventListener('mouseleave', handleElementMouseLeave);
        });

        // MutationObserver to handle dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const newMagneticElements = document.querySelectorAll('[data-magnetic="true"]');
                    newMagneticElements.forEach(el => {
                        el.removeEventListener('mouseenter', handleElementMouseEnter); // Prevent duplicates
                        el.removeEventListener('mouseleave', handleElementMouseLeave);
                        el.addEventListener('mouseenter', handleElementMouseEnter);
                        el.addEventListener('mouseleave', handleElementMouseLeave);
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseleave', handleMouseLeave);
            magneticElements.forEach(el => {
                el.removeEventListener('mouseenter', handleElementMouseEnter);
                el.removeEventListener('mouseleave', handleElementMouseLeave);
            });
            observer.disconnect();
        };
    }, [isVisible]);

    if (typeof window === 'undefined') return null;

    return (
        <div
            ref={cursorRef}
            className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${
                !isVisible ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div
                className={`rounded-full border transition-all duration-300 ease-out ${
                    isHovering
                        ? 'w-12 h-12 border-primary-500/30 bg-primary-500/10'
                        : 'w-5 h-5 border-gray-400/50 bg-transparent'
                }`}
            />
        </div>
    );
}
