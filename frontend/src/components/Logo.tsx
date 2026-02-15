
import React from 'react';

const Logo = ({ className = "h-8 w-8" }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Background Circle with Gradient */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Outer Ring / Magnifying Glass Frame */}
            <circle
                cx="45"
                cy="45"
                r="38"
                stroke="url(#logoGradient)"
                strokeWidth="8"
                className="drop-shadow-sm"
            />

            {/* Magnifying Glass Handle */}
            <path
                d="M72 72L92 92"
                stroke="url(#logoGradient)"
                strokeWidth="10"
                strokeLinecap="round"
            />

            {/* Monogram "I" and "T" integrated */}
            {/* The vertical bar of the T acts as the I */}
            <path
                d="M45 25V65"
                stroke="url(#logoGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#glow)"
            />
            <path
                d="M30 25H60"
                stroke="url(#logoGradient)"
                strokeWidth="8"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default Logo;
