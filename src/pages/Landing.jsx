import { Link } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { SignInModal, SignUpModal } from "../components/AuthModal";
import UserProfileMenu from "../components/UserProfileMenu";
import { theme } from "../theme";
import Button from "@mui/material/Button";
import "./Landing.css";

const FLIP_WORDS = ["Run.", "Build.", "Test.", "Ship."];

const FlipWord = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % FLIP_WORDS.length);
        }, 2200);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="pill-highlight">
            <span key={index} className="flip-word">
                {FLIP_WORDS[index]}
            </span>
        </span>
    );
};

const GeometricBackground = () => (
    <svg
        className="hero-geo-bg"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
    >
        {/* Circles */}
        <circle cx="120" cy="400" r="80" stroke="currentColor" strokeWidth="1" opacity="0.18" />
        <circle cx="120" cy="400" r="40" stroke="currentColor" strokeWidth="1" opacity="0.12" />
        <circle cx="1320" cy="200" r="120" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <circle cx="1320" cy="200" r="60" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        <circle cx="700" cy="700" r="90" stroke="currentColor" strokeWidth="1" opacity="0.1" />

        {/* Diamonds */}
        <rect x="180" y="580" width="50" height="50" transform="rotate(45 205 605)" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <rect x="420" y="120" width="36" height="36" transform="rotate(45 438 138)" stroke="currentColor" strokeWidth="1" opacity="0.18" />
        <rect x="1050" y="580" width="50" height="50" transform="rotate(45 1075 605)" stroke="currentColor" strokeWidth="1" opacity="0.18" />
        <rect x="1260" y="480" width="36" height="36" transform="rotate(45 1278 498)" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <rect x="860" y="60" width="30" height="30" transform="rotate(45 875 75)" stroke="currentColor" strokeWidth="1" opacity="0.15" />

        {/* Squares / rectangles */}
        <rect x="60" y="140" width="80" height="80" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <rect x="1260" y="580" width="100" height="70" stroke="currentColor" strokeWidth="1" opacity="0.12" />
        <rect x="580" y="640" width="60" height="60" stroke="currentColor" strokeWidth="1" opacity="0.12" />

        {/* Lines / connectors */}
        <line x1="200" y1="400" x2="420" y2="140" stroke="currentColor" strokeWidth="1" opacity="0.12" />
        <line x1="420" y1="140" x2="580" y2="140" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        <line x1="140" y1="580" x2="180" y2="605" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <line x1="1100" y1="200" x2="1260" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.12" />
        <line x1="1260" y1="480" x2="1260" y2="580" stroke="currentColor" strokeWidth="1" opacity="0.12" />
        <line x1="860" y1="90" x2="1050" y2="580" stroke="currentColor" strokeWidth="0.8" opacity="0.08" />

        {/* Branching lines (bottom) */}
        <line x1="300" y1="700" x2="420" y2="640" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        <line x1="420" y1="640" x2="580" y2="670" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        <line x1="580" y1="700" x2="700" y2="700" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        <line x1="700" y1="700" x2="860" y2="640" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        <line x1="860" y1="640" x2="1050" y2="605" stroke="currentColor" strokeWidth="1" opacity="0.1" />

        {/* Top connectors */}
        <line x1="60" y1="140" x2="200" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        <line x1="200" y1="80" x2="420" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        <line x1="420" y1="120" x2="860" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.08" />
        <line x1="860" y1="60" x2="1100" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        <line x1="1100" y1="80" x2="1320" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.1" />

        {/* Small accent cross */}
        <line x1="1380" y1="620" x2="1380" y2="660" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
        <line x1="1360" y1="640" x2="1400" y2="640" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />

        {/* Corner L-shapes */}
        <polyline points="60,220 60,140 140,140" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="none" />
        <polyline points="1300,140 1380,140 1380,220" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="none" />
    </svg>
);

const Typewriter = ({ lines, speed = 50, deleteSpeed = 30, pauseTime = 2000 }) => {
    const [lineIndex, setLineIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const currentLine = lines[lineIndex];
        const timer = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < currentLine.length) {
                    setDisplayText(currentLine.slice(0, displayText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setLineIndex((prev) => (prev + 1) % lines.length);
                }
            }
        }, isDeleting ? deleteSpeed : speed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, lineIndex, lines, speed, deleteSpeed, pauseTime]);

    useEffect(() => {
        const cursorTimer = setInterval(() => setShowCursor((prev) => !prev), 530);
        return () => clearInterval(cursorTimer);
    }, []);

    return (
        <span>
            {displayText}
            <span style={{ opacity: showCursor ? 1 : 0, color: theme.accent, transition: "opacity 0.1s" }}>|</span>
        </span>
    );
};

export default function Landing() {
    const { isLoaded } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [joinUrl, setJoinUrl] = useState("");
    const [showJoinModal, setShowJoinModal] = useState(false);

    const handleJoin = () => {
        const id = joinUrl.trim();
        if (!id) return;
        window.location.href = `${window.location.origin}/webide?session=${id}`;
    };

    useEffect(() => { setMounted(true); }, []);

    const handleSwitchToSignUp = () => { setShowSignIn(false); setShowSignUp(true); };
    const handleSwitchToSignIn = () => { setShowSignUp(false); setShowSignIn(true); };

    return (
        <div className="landing-page">
            <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} onSwitchToSignUp={handleSwitchToSignUp} />
            <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} onSwitchToSignIn={handleSwitchToSignIn} />

            {/* Navigation */}
            <nav className="landing-nav">
                <Link to="/" className="brand">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5"></polyline>
                        <line x1="12" y1="19" x2="20" y2="19"></line>
                    </svg>
                    <span className="brand-text">SubTerm</span>
                </Link>
<div className="nav-actions">
                    {!isLoaded ? (
                        <div className="nav-skeleton" />
                    ) : (
                        <>
                            <SignedOut>
                                <button className="btn-ghost" onClick={() => setShowSignIn(true)}>Log In</button>
                            </SignedOut>
                            <SignedIn>
                                <UserProfileMenu />
                            </SignedIn>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section
                className="hero-section"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(24px)",
                    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                }}
            >
                <GeometricBackground />

                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="hero-title-row">
                            Code. <FlipWord />
                        </span>
                        <br />
                        Deploy Instantly.
                    </h1>

                    <p className="hero-subtitle">
                        <Typewriter
                            lines={[
                                "A powerful cloud IDE with an integrated terminal.",
                                "Write, run, and deploy without leaving your browser.",
                                "Real-time collaboration built right in.",
                            ]}
                            speed={38}
                            deleteSpeed={22}
                            pauseTime={1800}
                        />
                    </p>

                    <div className="hero-actions">
                        {!isLoaded ? (
                            <div className="btn-skeleton" />
                        ) : (
                            <>
                                <SignedOut>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => setShowSignUp(true)}
                                        sx={{
                                            background: theme.accent,
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            fontSize: "15px",
                                            px: 4,
                                            "&:hover": { background: theme.accentHover },
                                        }}
                                    >
                                        Get started
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => setShowSignIn(true)}
                                        sx={{
                                            borderColor: "rgba(255,255,255,0.15)",
                                            color: "rgba(255,255,255,0.75)",
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            fontSize: "15px",
                                            px: 4,
                                            "&:hover": {
                                                borderColor: theme.accent,
                                                color: "#fff",
                                                background: "rgba(0,122,204,0.08)",
                                            },
                                        }}
                                    >
                                        Log In
                                    </Button>
                                </SignedOut>
                                <SignedIn>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        component={Link}
                                        to="/webide"
                                        sx={{
                                            background: theme.accent,
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            fontSize: "15px",
                                            px: 4,
                                            "&:hover": { background: theme.accentHover },
                                        }}
                                    >
                                        Open IDE →
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => setShowJoinModal(true)}
                                        sx={{
                                            borderColor: "rgba(255,255,255,0.15)",
                                            color: "rgba(255,255,255,0.75)",
                                            borderRadius: "8px",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            fontSize: "15px",
                                            px: 4,
                                            "&:hover": {
                                                borderColor: theme.accent,
                                                color: "#fff",
                                                background: "rgba(0,122,204,0.08)",
                                            },
                                        }}
                                    >
                                        Join Session
                                    </Button>
                                </SignedIn>
                            </>
                        )}
                    </div>

                </div>
            </section>

            {/* Join Session Modal */}
            {showJoinModal && (
                <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <p className="modal-title">Join a Collaboration</p>
                        <p className="modal-desc">Paste the session ID shared by your collaborator.</p>
                        <div className="modal-row">
                            <input
                                type="text"
                                value={joinUrl}
                                onChange={(e) => setJoinUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                                placeholder="Paste session ID..."
                                autoFocus
                                className="modal-input"
                            />
                            <button className="btn-primary" onClick={handleJoin} disabled={!joinUrl.trim()}>
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
