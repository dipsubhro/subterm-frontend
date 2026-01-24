import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { SignInModal, SignUpModal } from "../components/AuthModal";
import { theme } from "../theme";

const CodeBlock = () => (
    <div
        style={{
            background: theme.gutter,
            borderRadius: "12px",
            padding: "24px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "14px",
            lineHeight: "1.6",
            border: `1px solid ${theme.border}`,
            maxWidth: "500px",
            textAlign: "left",
        }}
    >
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
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: isHovered ? theme.border : theme.gutter,
                borderRadius: "12px",
                padding: "24px",
                border: `1px solid ${isHovered ? theme.accent : theme.border}`,
                transition: "all 0.2s ease",
                textAlign: "left",
                cursor: "default",
            }}
        >
            <div style={{ marginBottom: "12px", color: theme.accent }}>{icon}</div>
            <h3 style={{ color: theme.foreground, fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                {title}
            </h3>
            <p style={{ color: "#858585", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>
                {description}
            </p>
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
        <div
            style={{
                minHeight: "100vh",
                background: theme.background,
                color: theme.foreground,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >
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
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 48px",
                    borderBottom: `1px solid ${theme.border}`,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5"></polyline>
                        <line x1="12" y1="19" x2="20" y2="19"></line>
                    </svg>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: theme.accent }}>SubTerm</span>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
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
                                    onClick={() => setShowSignIn(true)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: theme.foreground,
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        padding: "8px 16px",
                                        transition: "color 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => (e.target.style.color = theme.accent)}
                                    onMouseLeave={(e) => (e.target.style.color = theme.foreground)}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setShowSignUp(true)}
                                    style={{
                                        background: theme.accent,
                                        border: "none",
                                        color: "#FFFFFF",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        padding: "8px 20px",
                                        borderRadius: "6px",
                                        fontWeight: "500",
                                        transition: "background 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => (e.target.style.background = theme.accentHover)}
                                    onMouseLeave={(e) => (e.target.style.background = theme.accent)}
                                >
                                    Get Started
                                </button>
                            </SignedOut>
                            <SignedIn>
                                <Link
                                    to="/webide"
                                    style={{
                                        background: theme.accent,
                                        color: "#FFFFFF",
                                        fontSize: "14px",
                                        padding: "8px 20px",
                                        borderRadius: "6px",
                                        fontWeight: "500",
                                        textDecoration: "none",
                                        transition: "background 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => (e.target.style.background = theme.accentHover)}
                                    onMouseLeave={(e) => (e.target.style.background = theme.accent)}
                                >
                                    Open IDE
                                </Link>
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
            <section
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "80px 24px",
                    minHeight: "70vh",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.6s ease-out",
                }}
            >
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: theme.gutter,
                        border: `1px solid ${theme.border}`,
                        borderRadius: "20px",
                        padding: "6px 16px",
                        marginBottom: "32px",
                        fontSize: "13px",
                        color: "#858585",
                    }}
                >
                    <span style={{ color: theme.string }}>●</span> Now in Beta
                </div>

                <h1
                    style={{
                        fontSize: "clamp(40px, 6vw, 72px)",
                        fontWeight: "800",
                        lineHeight: "1.1",
                        marginBottom: "24px",
                        maxWidth: "800px",
                    }}
                >
                    Code Anywhere.
                    <br />
                    <span style={{ color: theme.accent }}>Deploy Instantly.</span>
                </h1>

                <p
                    style={{
                        fontSize: "18px",
                        color: "#858585",
                        maxWidth: "600px",
                        lineHeight: "1.6",
                        marginBottom: "40px",
                        minHeight: "32px",
                    }}
                >
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
                </p>

                <div style={{ display: "flex", gap: "16px", marginBottom: "60px" }}>
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
                                    onClick={() => setShowSignUp(true)}
                                    style={{
                                        background: theme.accent,
                                        border: "none",
                                        color: "#FFFFFF",
                                        fontSize: "16px",
                                        cursor: "pointer",
                                        padding: "14px 32px",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        transition: "all 0.2s ease",
                                        boxShadow: `0 4px 14px ${theme.accent}40`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = theme.accentHover;
                                        e.target.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = theme.accent;
                                        e.target.style.transform = "translateY(0)";
                                    }}
                                >
                                    Start Coding Free
                                </button>
                            </SignedOut>
                            <SignedIn>
                                <Link
                                    to="/webide"
                                    style={{
                                        background: theme.accent,
                                        color: "#FFFFFF",
                                        fontSize: "16px",
                                        padding: "14px 32px",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        textDecoration: "none",
                                        transition: "all 0.2s ease",
                                        boxShadow: `0 4px 14px ${theme.accent}40`,
                                        display: "inline-block",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = theme.accentHover;
                                        e.target.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = theme.accent;
                                        e.target.style.transform = "translateY(0)";
                                    }}
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
            <section
                style={{
                    padding: "80px 48px",
                    borderTop: `1px solid ${theme.border}`,
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        fontSize: "32px",
                        fontWeight: "700",
                        marginBottom: "48px",
                    }}
                >
                    Everything you need to <span style={{ color: theme.accent }}>build faster</span>
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "24px",
                        maxWidth: "1000px",
                        margin: "0 auto",
                    }}
                >
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
            <footer
                style={{
                    borderTop: `1px solid ${theme.border}`,
                    padding: "32px 48px",
                    textAlign: "center",
                    color: "#858585",
                    fontSize: "14px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5"></polyline>
                        <line x1="12" y1="19" x2="20" y2="19"></line>
                    </svg>
                    <span>SubTerm © 2026. Built with ❤️</span>
                </div>
            </footer>
        </div>
    );
}
