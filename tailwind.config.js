import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#f0f5fa',
                    100: '#d9e6f2',
                    200: '#b8d1e8',
                    300: '#8FABD4',  // Light blue (user request)
                    400: '#6a8fc1',
                    500: '#5580b8',
                    600: '#4A70A9',  // Dark blue (user request) - Main color
                    700: '#3d5c8a',
                    800: '#344d71',
                    900: '#2e405e',
                    950: '#1f2a3e',
                },
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #4A70A9 0%, #8FABD4 100%)',
                'gradient-hero': 'linear-gradient(135deg, #3d5c8a 0%, #4A70A9 50%, #8FABD4 100%)',
                'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                'glass-xl': '0 8px 32px 0 rgba(31, 38, 135, 0.35)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float-slow 8s ease-in-out infinite',
                'float-3d': 'float-3d 6s ease-in-out infinite',
                'float-3d-css': 'float-3d-css 8s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'gradient': 'gradient 3s ease infinite',
                'fade-in': 'fade-in 0.8s ease-out forwards',
                'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                    '50%': { transform: 'translateY(-30px) translateX(10px)' },
                },
                'float-3d': {
                    '0%, 100%': {
                        transform: 'translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg)',
                    },
                    '25%': {
                        transform: 'translateY(-15px) translateZ(20px) rotateX(5deg) rotateY(-5deg)',
                    },
                    '50%': {
                        transform: 'translateY(-25px) translateZ(40px) rotateX(-5deg) rotateY(5deg)',
                    },
                    '75%': {
                        transform: 'translateY(-15px) translateZ(20px) rotateX(3deg) rotateY(-3deg)',
                    },
                },
                'float-3d-css': {
                    '0%, 100%': {
                        transform: 'translateY(0px) translateX(0px)',
                    },
                    '25%': {
                        transform: 'translateY(-20px) translateX(10px)',
                    },
                    '50%': {
                        transform: 'translateY(-30px) translateX(-10px)',
                    },
                    '75%': {
                        transform: 'translateY(-20px) translateX(5px)',
                    },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(74, 112, 169, 0.5)' },
                    '100%': { boxShadow: '0 0 40px rgba(74, 112, 169, 0.8)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-down': {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },

    plugins: [forms],
};
