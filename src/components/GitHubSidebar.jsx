import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const GitHubSidebar = ({ onImportSuccess }) => {
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
    setSelectedRepo(null);
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
    if (selectedRepo?.id === repo.id) {
       setSelectedRepo(null);
       setBranches([]);
       setSelectedBranch("");
       return;
    }
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
    } catch (err) {
      setError(err.message || "Failed to import repository");
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
      // Try to get GitHub username from Clerk if connected
      const githubAccount = user?.externalAccounts?.find(
        (acc) => acc.provider === "github"
      );
      if (githubAccount?.username) {
        setGithubUsername(githubAccount.username);
        // Auto-fetch if username is available
      }
  }, [user]);

  // Auto-fetch repos when username is set initially
  useEffect(() => {
      if(githubUsername && repos.length === 0 && !loading) {
          fetchRepos();
      }
  }, [githubUsername]);


  return (
    <div className="github-sidebar">
        <div className="sidebar-header">
            <h3>GitHub</h3>
        </div>

        {/* Tabs */}
        <div className="sidebar-tabs">
          <button
            onClick={() => setActiveTab("username")}
            className={activeTab === "username" ? "active" : ""}
          >
            My Repos
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={activeTab === "url" ? "active" : ""}
          >
            Clone URL
          </button>
        </div>

        {/* Content */}
        <div className="sidebar-content">
          {activeTab === "username" ? (
            <>
              {/* Username Input */}
              <div className="input-group">
                <div className="search-box">
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchRepos()}
                    placeholder="Username"
                  />
                  <button
                    onClick={fetchRepos}
                    disabled={loading || !githubUsername.trim()}
                    title="Fetch Repositories"
                  >
                    {loading ? "..." : "Go"}
                  </button>
                </div>
              </div>

              {/* Repos List */}
              <div className="repo-list">
                    {repos.map((repo) => (
                      <div key={repo.id} className="repo-item">
                        <div
                            className={`repo-header ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                            onClick={() => handleRepoSelect(repo)}
                        >
                            <span className="repo-name">{repo.name}</span>
                            <span className="repo-stars">★ {repo.stargazers_count}</span>
                        </div>
                        
                        {selectedRepo?.id === repo.id && (
                            <div className="repo-details">
                                <div className="branch-select">
                                    {loadingBranches ? (
                                        <span>Loading branches...</span>
                                    ) : (
                                        <select
                                            value={selectedBranch}
                                            onChange={(e) => setSelectedBranch(e.target.value)}
                                        >
                                            {branches.map((branch) => (
                                                <option key={branch.name} value={branch.name}>
                                                    {branch.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <button 
                                    className="import-btn"
                                    onClick={handleImport}
                                    disabled={importing || !selectedBranch}
                                >
                                    {importing ? "Importing..." : "Import"}
                                </button>
                            </div>
                        )}
                      </div>
                    ))}
                    {repos.length === 0 && !loading && (
                        <div className="empty-state">No repositories found</div>
                    )}
              </div>
            </>
          ) : (
            /* URL Tab */
            <div className="url-import">
              <input
                type="text"
                value={manualRepoUrl}
                onChange={(e) => setManualRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
              />
              <button
                className="import-btn full-width"
                onClick={handleImport}
                disabled={importing || !manualRepoUrl.trim()}
              >
                 {importing ? "Importing..." : "Clone"}
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
    </div>
  );
};

export default GitHubSidebar;
