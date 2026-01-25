import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const GitHubImportModal = ({ isOpen, onClose, onImportSuccess }) => {
  const { user } = useUser();
  const [repos, setRepos] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [manualRepoUrl, setManualRepoUrl] = useState("");
  const [activeTab, setActiveTab] = useState("username"); // 'username' | 'url'

  // Fetch repos when username changes
  const fetchRepos = async () => {
    if (!githubUsername.trim()) {
      setRepos([]);
      return;
    }

    setLoading(true);
    setError("");
    setRepos([]);
    setSelectedRepo(null);doesn
    setBranches([]);

    try {
      const response = await fetch(
        `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        }
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError(err.message || "Failed to fetch repositories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch branches when repo is selected
  const fetchBranches = async (repo) => {
    setLoadingBranches(true);
    setBranches([]);
    setSelectedBranch("");

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo.full_name}/branches`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }

      const data = await response.json();
      setBranches(data);
      // Set default branch
      setSelectedBranch(repo.default_branch || (data[0]?.name ?? ""));
    } catch (err) {
      setError(err.message || "Failed to fetch branches");
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    fetchBranches(repo);
  };

  const handleImport = async () => {
    setImporting(true);
    setError("");

    try {
      let repoUrl, branch, repoName;

      if (activeTab === "url") {
        // Parse manual URL
        const urlMatch = manualRepoUrl.match(
          /github\.com\/([^\/]+)\/([^\/\.]+)/
        );
        if (!urlMatch) {
          throw new Error("Invalid GitHub URL format");
        }
        repoUrl = manualRepoUrl.endsWith(".git")
          ? manualRepoUrl
          : `${manualRepoUrl}.git`;
        branch = "main"; // Default to main for manual URL
        repoName = urlMatch[2];
      } else {
        if (!selectedRepo || !selectedBranch) {
          throw new Error("Please select a repository and branch");
        }
        repoUrl = selectedRepo.clone_url;
        branch = selectedBranch;
        repoName = selectedRepo.name;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API}/github/import`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            repoUrl,
            branch,
            repoName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to import repository");
      }

      onImportSuccess?.(result.message || "Repository imported successfully!");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to import repository");
    } finally {
      setImporting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Try to get GitHub username from Clerk if connected
      const githubAccount = user?.externalAccounts?.find(
        (acc) => acc.provider === "github"
      );
      if (githubAccount?.username) {
        setGithubUsername(githubAccount.username);
      }
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#1E1E1E",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #3A3A3A",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #2A2A2A",
            background: "#252526",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#D4D4D4"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span
              style={{
                color: "#D4D4D4",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Import from GitHub
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#858585"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #2A2A2A",
            background: "#252526",
          }}
        >
          <button
            onClick={() => setActiveTab("username")}
            style={{
              flex: 1,
              padding: "12px",
              background: activeTab === "username" ? "#1E1E1E" : "transparent",
              border: "none",
              borderBottom:
                activeTab === "username" ? "2px solid #007ACC" : "none",
              color: activeTab === "username" ? "#007ACC" : "#858585",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
          >
            Browse Repositories
          </button>
          <button
            onClick={() => setActiveTab("url")}
            style={{
              flex: 1,
              padding: "12px",
              background: activeTab === "url" ? "#1E1E1E" : "transparent",
              border: "none",
              borderBottom: activeTab === "url" ? "2px solid #007ACC" : "none",
              color: activeTab === "url" ? "#007ACC" : "#858585",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
          >
            Clone by URL
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "20px",
          }}
        >
          {activeTab === "username" ? (
            <>
              {/* Username Input */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#BBBBBB",
                    fontSize: "12px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  GitHub Username
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchRepos()}
                    placeholder="Enter GitHub username"
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      background: "#3C3C3C",
                      border: "1px solid #4A4A4A",
                      borderRadius: "6px",
                      color: "#D4D4D4",
                      fontSize: "14px",
                      fontFamily: "'JetBrains Mono', monospace",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={fetchRepos}
                    disabled={loading || !githubUsername.trim()}
                    style={{
                      padding: "10px 20px",
                      background: loading ? "#3A3A3A" : "#007ACC",
                      border: "none",
                      borderRadius: "6px",
                      color: "#FFFFFF",
                      fontSize: "14px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {loading ? (
                      <>
                        <div
                          style={{
                            width: "14px",
                            height: "14px",
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                        Loading...
                      </>
                    ) : (
                      "Fetch Repos"
                    )}
                  </button>
                </div>
              </div>

              {/* Repos List */}
              {repos.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      color: "#BBBBBB",
                      fontSize: "12px",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Select Repository ({repos.length} found)
                  </label>
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: "1px solid #3A3A3A",
                      borderRadius: "6px",
                      background: "#252526",
                    }}
                  >
                    {repos.map((repo) => (
                      <div
                        key={repo.id}
                        onClick={() => handleRepoSelect(repo)}
                        style={{
                          padding: "12px 14px",
                          cursor: "pointer",
                          borderBottom: "1px solid #2A2A2A",
                          background:
                            selectedRepo?.id === repo.id
                              ? "rgba(0, 122, 204, 0.2)"
                              : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedRepo?.id !== repo.id) {
                            e.currentTarget.style.background = "#2A2A2A";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRepo?.id !== repo.id) {
                            e.currentTarget.style.background = "transparent";
                          }
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: "#D4D4D4",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            {repo.name}
                          </div>
                          {repo.description && (
                            <div
                              style={{
                                color: "#858585",
                                fontSize: "12px",
                                marginTop: "4px",
                                maxWidth: "400px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {repo.description}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {repo.private && (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#DCDCAA"
                              strokeWidth="2"
                            >
                              <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                                ry="2"
                              />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          )}
                          <span
                            style={{
                              color: "#858585",
                              fontSize: "11px",
                            }}
                          >
                            ⭐ {repo.stargazers_count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Branch Selector */}
              {selectedRepo && (
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#BBBBBB",
                      fontSize: "12px",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Select Branch
                  </label>
                  {loadingBranches ? (
                    <div
                      style={{
                        padding: "12px",
                        color: "#858585",
                        fontSize: "13px",
                      }}
                    >
                      Loading branches...
                    </div>
                  ) : (
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "#3C3C3C",
                        border: "1px solid #4A4A4A",
                        borderRadius: "6px",
                        color: "#D4D4D4",
                        fontSize: "14px",
                        fontFamily: "'JetBrains Mono', monospace",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      {branches.map((branch) => (
                        <option key={branch.name} value={branch.name}>
                          {branch.name}
                          {branch.name === selectedRepo.default_branch
                            ? " (default)"
                            : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </>
          ) : (
            /* URL Tab */
            <div>
              <label
                style={{
                  display: "block",
                  color: "#BBBBBB",
                  fontSize: "12px",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Repository URL
              </label>
              <input
                type="text"
                value={manualRepoUrl}
                onChange={(e) => setManualRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "#3C3C3C",
                  border: "1px solid #4A4A4A",
                  borderRadius: "6px",
                  color: "#D4D4D4",
                  fontSize: "14px",
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <p
                style={{
                  color: "#858585",
                  fontSize: "12px",
                  marginTop: "12px",
                }}
              >
                Paste a GitHub repository URL to clone. The repository will be
                cloned with the default branch (main/master).
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 14px",
                background: "rgba(244, 67, 54, 0.1)",
                border: "1px solid #F44336",
                borderRadius: "6px",
                color: "#F44336",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            padding: "16px 20px",
            borderTop: "1px solid #2A2A2A",
            background: "#252526",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              background: "transparent",
              border: "1px solid #4A4A4A",
              borderRadius: "6px",
              color: "#D4D4D4",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={
              importing ||
              (activeTab === "username"
                ? !selectedRepo || !selectedBranch
                : !manualRepoUrl.trim())
            }
            style={{
              padding: "10px 24px",
              background:
                importing ||
                (activeTab === "username"
                  ? !selectedRepo || !selectedBranch
                  : !manualRepoUrl.trim())
                  ? "#3A3A3A"
                  : "#007ACC",
              border: "none",
              borderRadius: "6px",
              color: "#FFFFFF",
              fontSize: "14px",
              cursor:
                importing ||
                (activeTab === "username"
                  ? !selectedRepo || !selectedBranch
                  : !manualRepoUrl.trim())
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {importing ? (
              <>
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Importing...
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Import Repository
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GitHubImportModal;
