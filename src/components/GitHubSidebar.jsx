import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import api from "../lib/axios";
import { useFileStore, useUIStore } from "../store";

const GitHubSidebar = ({ className = "" }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
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

  // ── Zustand stores ──
  const triggerReloadTree = useFileStore((s) => s.triggerReloadTree);
  const showToast = useUIStore((s) => s.showToast);

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
      const { data } = await axios.get(
        `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`
      );
      setRepos(data);
    } catch (err) {
      const msg = err.response?.status === 404 ? "User not found" : err.message;
      setError(msg || "Failed to fetch repositories");
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
      const { data } = await axios.get(
        `https://api.github.com/repos/${repo.full_name}/branches`
      );
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

  // Import mutation using TanStack Query + axios
  const importMutation = useMutation({
    mutationFn: (payload) => api.post("/github/import", payload).then((res) => res.data),
    onSuccess: (result) => {
      showToast(result.message || "Repository imported successfully!");
      triggerReloadTree();
      queryClient.invalidateQueries({ queryKey: ["fileTree"] });
    },
    onError: (err) => {
      setError(err.response?.data?.error || err.message || "Failed to import repository");
    },
    onSettled: () => {
      setImporting(false);
    },
  });

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

      importMutation.mutate({ repoUrl, branch, repoName });
    } catch (err) {
      setError(err.message || "Failed to import repository");
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
    <div className={`github-sidebar ${className}`}>
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
