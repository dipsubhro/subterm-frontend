import { useState, useEffect } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { theme } from "../theme";

// Icons
const GithubIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const TerminalIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
);

const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

const Spinner = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
        <circle cx="12" cy="12" r="10" stroke={theme.accent} strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
);

// Styles
const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
};

const modalContainerStyle = {
    background: `linear-gradient(145deg, ${theme.background} 0%, ${theme.gutter} 100%)`,
    borderRadius: "16px",
    border: `1px solid ${theme.border}`,
    boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px ${theme.border}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
    maxWidth: "420px",
    width: "100%",
    position: "relative",
    overflow: "hidden",
};

const modalHeaderStyle = {
    padding: "32px 32px 24px",
    textAlign: "center",
    borderBottom: `1px solid ${theme.border}`,
    background: `linear-gradient(180deg, rgba(0, 122, 204, 0.05) 0%, transparent 100%)`,
};

const modalBodyStyle = {
    padding: "24px 32px 32px",
};

const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: `1px solid ${theme.border}`,
    background: theme.gutter,
    color: theme.foreground,
    fontSize: "15px",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
};

const inputFocusStyle = {
    ...inputStyle,
    borderColor: theme.accent,
    boxShadow: `0 0 0 3px ${theme.accent}20`,
};

const labelStyle = {
    display: "block",
    color: theme.foreground,
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "8px",
};

const buttonStyle = {
    width: "100%",
    padding: "14px 24px",
    borderRadius: "10px",
    border: "none",
    background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
};

const socialButtonStyle = {
    flex: 1,
    padding: "14px 16px",
    borderRadius: "10px",
    border: `1px solid ${theme.border}`,
    background: theme.gutter,
    color: theme.foreground,
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
};

const errorStyle = {
    background: `${theme.error}15`,
    border: `1px solid ${theme.error}40`,
    borderRadius: "10px",
    padding: "12px 16px",
    color: theme.error,
    fontSize: "13px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

// Input Component
const Input = ({ label, type, value, onChange, placeholder, error, autoFocus, name }) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: "relative" }}>
                <input
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    name={name}
                    style={focused ? inputFocusStyle : { ...inputStyle, borderColor: error ? theme.error : theme.border }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            color: "#858585",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                )}
            </div>
        </div>
    );
};

// Sign In Modal
export const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
    const { signIn, isLoaded, setActive } = useSignIn();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setEmail("");
            setPassword("");
            setError("");
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;

        setLoading(true);
        setError("");

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                onClose();
            }
        } catch (err) {
            setError(err.errors?.[0]?.longMessage || err.message || "Sign in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider) => {
        if (!isLoaded) return;

        try {
            await signIn.authenticateWithRedirect({
                strategy: `oauth_${provider}`,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (err) {
            setError(err.errors?.[0]?.longMessage || err.message || "OAuth sign in failed.");
        }
    };

    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        color: "#858585",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = theme.border;
                        e.target.style.color = theme.foreground;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = "none";
                        e.target.style.color = "#858585";
                    }}
                >
                    <CloseIcon />
                </button>

                {/* Header */}
                <div style={modalHeaderStyle}>
                    <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                        <TerminalIcon />
                    </div>
                    <h2 style={{ color: theme.foreground, fontSize: "24px", fontWeight: "700", margin: 0 }}>
                        Welcome back
                    </h2>
                    <p style={{ color: "#858585", fontSize: "14px", margin: "8px 0 0" }}>
                        Sign in to continue to SubTerm
                    </p>
                </div>

                {/* Body */}
                <div style={modalBodyStyle}>
                    {/* Social Buttons */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                        <button
                            onClick={() => handleOAuth("google")}
                            style={socialButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = theme.border;
                                e.currentTarget.style.borderColor = theme.accent;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = theme.gutter;
                                e.currentTarget.style.borderColor = theme.border;
                            }}
                        >
                            <GoogleIcon />
                            Google
                        </button>
                        <button
                            onClick={() => handleOAuth("github")}
                            style={socialButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = theme.border;
                                e.currentTarget.style.borderColor = theme.accent;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = theme.gutter;
                                e.currentTarget.style.borderColor = theme.border;
                            }}
                        >
                            <GithubIcon />
                            GitHub
                        </button>
                    </div>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                        <div style={{ flex: 1, height: "1px", background: theme.border }}></div>
                        <span style={{ color: "#858585", fontSize: "13px" }}>or continue with email</span>
                        <div style={{ flex: 1, height: "1px", background: theme.border }}></div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={errorStyle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoFocus
                            name="email"
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            name="password"
                        />

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            style={{
                                ...buttonStyle,
                                opacity: loading || !email || !password ? 0.6 : 1,
                                cursor: loading || !email || !password ? "not-allowed" : "pointer",
                            }}
                            onMouseEnter={(e) => {
                                if (!loading && email && password) {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accent}40`;
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            {loading ? <Spinner /> : "Sign In"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p style={{ textAlign: "center", marginTop: "24px", color: "#858585", fontSize: "14px" }}>
                        Don't have an account?{" "}
                        <button
                            onClick={onSwitchToSignUp}
                            style={{
                                background: "none",
                                border: "none",
                                color: theme.accent,
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "14px",
                                padding: 0,
                            }}
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Sign Up Modal
export const SignUpModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
    const { signUp, isLoaded, setActive } = useSignUp();
    const [step, setStep] = useState("form"); // form, verify
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep("form");
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setCode("");
            setError("");
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;

        setLoading(true);
        setError("");

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password,
            });

            // Send email verification
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setStep("verify");
        } catch (err) {
            setError(err.errors?.[0]?.longMessage || err.message || "Sign up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;

        setLoading(true);
        setError("");

        try {
            const result = await signUp.attemptEmailAddressVerification({ code });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                onClose();
            }
        } catch (err) {
            setError(err.errors?.[0]?.longMessage || err.message || "Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider) => {
        if (!isLoaded) return;

        try {
            await signUp.authenticateWithRedirect({
                strategy: `oauth_${provider}`,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (err) {
            setError(err.errors?.[0]?.longMessage || err.message || "OAuth sign up failed.");
        }
    };

    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        color: "#858585",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = theme.border;
                        e.target.style.color = theme.foreground;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = "none";
                        e.target.style.color = "#858585";
                    }}
                >
                    <CloseIcon />
                </button>

                {/* Header */}
                <div style={modalHeaderStyle}>
                    <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                        <TerminalIcon />
                    </div>
                    <h2 style={{ color: theme.foreground, fontSize: "24px", fontWeight: "700", margin: 0 }}>
                        {step === "verify" ? "Verify your email" : "Create your account"}
                    </h2>
                    <p style={{ color: "#858585", fontSize: "14px", margin: "8px 0 0" }}>
                        {step === "verify"
                            ? `We've sent a code to ${email}`
                            : "Start coding in the cloud today"}
                    </p>
                </div>

                {/* Body */}
                <div style={modalBodyStyle}>
                    {step === "form" ? (
                        <>
                            {/* Social Buttons */}
                            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                                <button
                                    onClick={() => handleOAuth("google")}
                                    style={socialButtonStyle}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = theme.border;
                                        e.currentTarget.style.borderColor = theme.accent;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = theme.gutter;
                                        e.currentTarget.style.borderColor = theme.border;
                                    }}
                                >
                                    <GoogleIcon />
                                    Google
                                </button>
                                <button
                                    onClick={() => handleOAuth("github")}
                                    style={socialButtonStyle}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = theme.border;
                                        e.currentTarget.style.borderColor = theme.accent;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = theme.gutter;
                                        e.currentTarget.style.borderColor = theme.border;
                                    }}
                                >
                                    <GithubIcon />
                                    GitHub
                                </button>
                            </div>

                            {/* Divider */}
                            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                                <div style={{ flex: 1, height: "1px", background: theme.border }}></div>
                                <span style={{ color: "#858585", fontSize: "13px" }}>or continue with email</span>
                                <div style={{ flex: 1, height: "1px", background: theme.border }}></div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div style={errorStyle}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <div style={{ flex: 1 }}>
                                        <Input
                                            label="First name"
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                            autoFocus
                                            name="firstName"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Input
                                            label="Last name"
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                            name="lastName"
                                        />
                                    </div>
                                </div>
                                <Input
                                    label="Email address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    name="email"
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    name="password"
                                />

                                <button
                                    type="submit"
                                    disabled={loading || !firstName || !lastName || !email || !password}
                                    style={{
                                        ...buttonStyle,
                                        opacity: loading || !firstName || !lastName || !email || !password ? 0.6 : 1,
                                        cursor: loading || !firstName || !lastName || !email || !password ? "not-allowed" : "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading && firstName && lastName && email && password) {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accent}40`;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    {loading ? <Spinner /> : "Create Account"}
                                </button>
                            </form>

                            {/* Footer */}
                            <p style={{ textAlign: "center", marginTop: "24px", color: "#858585", fontSize: "14px" }}>
                                Already have an account?{" "}
                                <button
                                    onClick={onSwitchToSignIn}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: theme.accent,
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        padding: 0,
                                    }}
                                >
                                    Sign in
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            {/* Error Message */}
                            {error && (
                                <div style={errorStyle}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Verification Form */}
                            <form onSubmit={handleVerify}>
                                <Input
                                    label="Verification code"
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    autoFocus
                                    name="code"
                                />

                                <button
                                    type="submit"
                                    disabled={loading || !code}
                                    style={{
                                        ...buttonStyle,
                                        opacity: loading || !code ? 0.6 : 1,
                                        cursor: loading || !code ? "not-allowed" : "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading && code) {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accent}40`;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    {loading ? <Spinner /> : "Verify Email"}
                                </button>
                            </form>

                            <button
                                onClick={() => setStep("form")}
                                style={{
                                    width: "100%",
                                    marginTop: "16px",
                                    padding: "12px",
                                    background: "none",
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: "10px",
                                    color: "#858585",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = theme.gutter;
                                    e.currentTarget.style.borderColor = theme.accent;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "none";
                                    e.currentTarget.style.borderColor = theme.border;
                                }}
                            >
                                ← Back to sign up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
