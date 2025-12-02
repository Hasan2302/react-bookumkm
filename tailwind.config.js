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

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
                poppins: ['Poppins', 'sans-serif'],
            },
            colors: {
                // Brand Palette (Soft Blue / Modern Calm)
                brand: {
                    50: '#f0f7ff',  // Sangat transparan, cocok untuk background tabel
                    100: '#e0f0fe',
                    200: '#bae2fd',
                    300: '#7ccbfd',
                    400: '#36b2f9',
                    500: '#0ea5e9', // Warna Utama (Soft Sky Blue) - Tenang tapi jelas
                    600: '#0284c7', // Hover state
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49', // Warna teks gelap / Border tajam
                },
                // Metronic Palette
                primary: {
                    DEFAULT: '#009EF7', // Blue
                    active: '#0095E8',
                    light: '#F1FAFF',
                    // Add shades for compatibility if needed, but Metronic uses specific hexes
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                success: {
                    DEFAULT: '#50CD89', // Green
                    active: '#47BE7D',
                    light: '#E8FFF3',
                },
                warning: {
                    DEFAULT: '#FFC700', // Yellow
                    active: '#F1BC00',
                    light: '#FFF8DD',
                },
                danger: {
                    DEFAULT: '#F1416C', // Red
                    active: '#D9214E',
                    light: '#FFF5F8',
                },
                info: {
                    DEFAULT: '#7239EA', // Purple
                    active: '#5014D0',
                    light: '#F8F5FF',
                },
                dark: {
                    DEFAULT: '#181C32', // Dark Text
                    active: '#131628',
                    light: '#EFF2F5',   // Light Gray Background
                    sidebar: '#1E1E2D', // Sidebar Dark
                },
                light: '#F9F9F9',
                gray: {
                    100: '#F5F8FA',
                    200: '#EFF2F5',
                    300: '#E4E6EF',
                    400: '#B5B5C3',
                    500: '#A1A5B7',
                    600: '#7E8299',
                    700: '#5E6278',
                    800: '#3F4254',
                    900: '#181C32',
                },
            },
            backgroundImage: {
                // Modern gradients for light mode
                'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', // Brand 600 -> 700
                'gradient-hero': 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)', // Brand 700 -> 600 -> 500
                'gradient-light': 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',

                // Glassmorphism
                'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            },

            glass: 'rgba(255, 255, 255, 0.15)',
            'glass-dark': 'rgba(0, 0, 0, 0.3)',
            backdropBlur: {
                xs: '2px',
            },

            boxShadow: {
                // Linear-style subtle shadows
                'linear-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                'linear-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'linear': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'linear-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'linear-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'linear-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float-slow 8s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out forwards',
                'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
                'scale-in': 'scale-in 0.3s ease-out forwards',
                'gradient-x': 'gradient-x 3s ease infinite',
                'marquee': 'marquee 25s linear infinite',
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
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    },
                },
                'marquee': {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
        },
    },

    plugins: [forms],
};
