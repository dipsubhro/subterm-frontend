import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { SignInModal, SignUpModal } from "../components/AuthModal";
import { theme } from "../theme";
import "./Landing.css";

const CodeBlock = () => (
    <div className="code-preview">
        <div className="code-header">
            <div className="window-dot red"></div>
            <div className="window-dot yellow"></div>
            <div className="window-dot green"></div>
        </div>
        <div style={{ marginBottom: "8px" }}>
            <span style={{ color: theme.keyword }}>const</span>{" "}
            <span style={{ color: theme.variable }}>project</span>{" "}
            <span style={{ color: theme.foreground }}>=</span>{" "}
            <span style={{ color: theme.keyword }}>new</span>{" "}
            <span style={{ color: theme.type }}>SubTerm</span>
            <span style={{ color: theme.foreground }}>();</span>
        </div>
        <div style={{ marginBottom: "8px" }}>
            <span style={{ color: theme.variable }}>project</span>
            <span style={{ color: theme.foreground }}>.</span>
            <span style={{ color: theme.function }}>run</span>
            <span style={{ color: theme.foreground }}>(</span>
            <span style={{ color: theme.string }}>"npm start"</span>
            <span style={{ color: theme.foreground }}>);</span>
        </div>
        <div>
            <span style={{ color: "#6A737D" }}>// ✨ Your code runs instantly</span>
        </div>
    </div>
);

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="feature-card">
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

const Typewriter = ({ lines, speed = 50, deleteSpeed = 30, pauseTime = 2000 }) => {
    const [lineIndex, setLineIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const currentLine = lines[lineIndex];
        
        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (displayText.length < currentLine.length) {
                    setDisplayText(currentLine.slice(0, displayText.length + 1));
                } else {
                    // Finished typing, pause then start deleting
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                // Deleting
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    // Finished deleting, move to next line
                    setIsDeleting(false);
                    setLineIndex((prev) => (prev + 1) % lines.length);
                }
            }
        }, isDeleting ? deleteSpeed : speed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, lineIndex, lines, speed, deleteSpeed, pauseTime]);

    useEffect(() => {
        const cursorTimer = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 530);
        return () => clearInterval(cursorTimer);
    }, []);

    return (
        <span>
            {displayText}
            <span
                style={{
                    opacity: showCursor ? 1 : 0,
                    color: theme.accent,
                    fontWeight: "400",
                    transition: "opacity 0.1s",
                }}
            >
                |
            </span>
        </span>
    );
};

export default function Landing() {
    const { isLoaded } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSwitchToSignUp = () => {
        setShowSignIn(false);
        setShowSignUp(true);
    };

    const handleSwitchToSignIn = () => {
        setShowSignUp(false);
        setShowSignIn(true);
    };

    return (
        <div className="landing-page">
            {/* Auth Modals */}
            <SignInModal
                isOpen={showSignIn}
                onClose={() => setShowSignIn(false)}
                onSwitchToSignUp={handleSwitchToSignUp}
            />
            <SignUpModal
                isOpen={showSignUp}
                onClose={() => setShowSignUp(false)}
                onSwitchToSignIn={handleSwitchToSignIn}
            />

            {/* Navigation */}
            <nav className="landing-nav">
                <Link to="/" className="brand">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5"></polyline>
                        <line x1="12" y1="19" x2="20" y2="19"></line>
                    </svg>
                    <span className="brand-text">SubTerm</span>
                </Link>
                <div className="nav-actions">
                    {!isLoaded ? (
                        <div style={{
                            width: "120px",
                            height: "36px",
                            background: theme.gutter,
                            borderRadius: "6px",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }} />
                    ) : (
                        <>
                            <SignedOut>
                                <button
                                    className="btn-ghost"
                                    onClick={() => setShowSignIn(true)}
                                >
                                    Sign In
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={() => setShowSignUp(true)}
                                >
                                    Get Started
                                </button>
                            </SignedOut>
                            <SignedIn>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: {
                                                width: "36px",
                                                height: "36px",
                                            },
                                        },
                                    }}
                                />
                            </SignedIn>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section" style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out",
            }}>
                <div className="hero-badge">
                    <span style={{ color: theme.string }}>●</span> Now in Beta
                </div>

                <h1 className="hero-title">
                    Code Anywhere.
                    <br />
                    <span className="gradient-text">Deploy Instantly.</span>
                </h1>

                <div className="hero-subtitle">
                    <Typewriter
                        lines={[
                            "A powerful cloud IDE with an integrated terminal.",
                            "Write.",
                            "Run.",
                            "Deploy your code without leaving your browser.",
                        ]}
                        speed={40}
                        deleteSpeed={25}
                        pauseTime={1500}
                    />
                </div>

                <div className="hero-actions">
                    {!isLoaded ? (
                        <div style={{
                            width: "180px",
                            height: "48px",
                            background: theme.gutter,
                            borderRadius: "8px",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }} />
                    ) : (
                        <>
                            <SignedOut>
                                <button
                                    className="btn-primary btn-large"
                                    onClick={() => setShowSignUp(true)}
                                >
                                    Start Coding Free
                                </button>
                            </SignedOut>
                            <SignedIn>
                                <Link
                                    to="/webide"
                                    className="btn-primary btn-large"
                                >
                                    Open IDE →
                                </Link>
                            </SignedIn>
                        </>
                    )}
                </div>

                <CodeBlock />
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">
                    Everything you need to <span style={{ color: theme.accent }}>build faster</span>
                </h2>

                <div className="features-grid">
                    <FeatureCard
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="4 17 10 11 4 5"></polyline>
                                <line x1="12" y1="19" x2="20" y2="19"></line>
                            </svg>
                        }
                        title="Integrated Terminal"
                        description="Full-featured terminal with all your favorite tools. Run commands, install packages, and manage your project."
                    />
                    <FeatureCard
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                        }
                        title="File Explorer"
                        description="Navigate your project with an intuitive file tree. Create, rename, and organize files effortlessly."
                    />
                    <FeatureCard
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        }
                        title="Instant Preview"
                        description="See your changes in real-time. No more waiting for builds or refreshing browsers."
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 17 10 11 4 5"></polyline>
                            <line x1="12" y1="19" x2="20" y2="19"></line>
                        </svg>
                        <span>SubTerm © 2026. Built with <span className="heart-icon">❤️</span></span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
