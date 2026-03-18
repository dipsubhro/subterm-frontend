export default function GeometricBackground({ className = "hero-geo-bg" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 1440 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
        >
            <circle cx="120" cy="400" r="80" stroke="currentColor" strokeWidth="1" opacity="0.18" />
            <circle cx="120" cy="400" r="40" stroke="currentColor" strokeWidth="1" opacity="0.12" />
            <circle cx="1320" cy="200" r="120" stroke="currentColor" strokeWidth="1" opacity="0.15" />
            <circle cx="1320" cy="200" r="60" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <circle cx="700" cy="700" r="90" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <rect x="180" y="580" width="50" height="50" transform="rotate(45 205 605)" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <rect x="420" y="120" width="36" height="36" transform="rotate(45 438 138)" stroke="currentColor" strokeWidth="1" opacity="0.18" />
            <rect x="1050" y="580" width="50" height="50" transform="rotate(45 1075 605)" stroke="currentColor" strokeWidth="1" opacity="0.18" />
            <rect x="1260" y="480" width="36" height="36" transform="rotate(45 1278 498)" stroke="currentColor" strokeWidth="1" opacity="0.15" />
            <rect x="860" y="60" width="30" height="30" transform="rotate(45 875 75)" stroke="currentColor" strokeWidth="1" opacity="0.15" />
            <rect x="60" y="140" width="80" height="80" stroke="currentColor" strokeWidth="1" opacity="0.15" />
            <rect x="1260" y="580" width="100" height="70" stroke="currentColor" strokeWidth="1" opacity="0.12" />
            <rect x="580" y="640" width="60" height="60" stroke="currentColor" strokeWidth="1" opacity="0.12" />
            <line x1="200" y1="400" x2="420" y2="140" stroke="currentColor" strokeWidth="1" opacity="0.12" />
            <line x1="420" y1="140" x2="580" y2="140" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="140" y1="580" x2="180" y2="605" stroke="currentColor" strokeWidth="1" opacity="0.15" />
            <line x1="1100" y1="200" x2="1260" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.12" />
            <line x1="1260" y1="480" x2="1260" y2="580" stroke="currentColor" strokeWidth="1" opacity="0.12" />
            <line x1="860" y1="90" x2="1050" y2="580" stroke="currentColor" strokeWidth="0.8" opacity="0.08" />
            <line x1="300" y1="700" x2="420" y2="640" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="420" y1="640" x2="580" y2="670" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="580" y1="700" x2="700" y2="700" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="700" y1="700" x2="860" y2="640" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="860" y1="640" x2="1050" y2="605" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="60" y1="140" x2="200" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="200" y1="80" x2="420" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="420" y1="120" x2="860" y2="60" stroke="currentColor" strokeWidth="0.8" opacity="0.08" />
            <line x1="860" y1="60" x2="1100" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="1100" y1="80" x2="1320" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="1380" y1="620" x2="1380" y2="660" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
            <line x1="1360" y1="640" x2="1400" y2="640" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
            <polyline points="60,220 60,140 140,140" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="none" />
            <polyline points="1300,140 1380,140 1380,220" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="none" />
        </svg>
    );
}
