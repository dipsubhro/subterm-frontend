// VS Code-style file icons mapped by extension and special filenames
// Uses react-icons for high-quality, recognizable language/tool icons

import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiPython,
  SiHtml5,
  SiCss3,
  SiSass,
  SiJson,
  SiMarkdown,
  SiYaml,
  SiDocker,
  SiGit,
  SiNpm,
  SiGnubash,
  SiRuby,
  SiPhp,
  SiSwift,
  SiKotlin,
  SiRust,
  SiGo,
  SiLua,
  SiC,
  SiCplusplus,
  SiDotnet,
  SiPerl,
  SiR,
  SiSvg,
  SiToml,
  SiGraphql,
  SiVuedotjs,
  SiSvelte,
  SiDart,
  SiElixir,
  SiHaskell,
  SiScala,
  SiClojure,
  SiZig,
} from "react-icons/si";

import {
  VscFile,
  VscFileMedia,
  VscFilePdf,
  VscFileZip,
  VscDatabase,
  VscLock,
  VscSettingsGear,
  VscTerminalBash,
} from "react-icons/vsc";

import { DiJava } from "react-icons/di";

// ── Extension → icon mapping ──────────────────────────────────

const ICON_SIZE = 16;

const EXTENSION_MAP = {
  // JavaScript / TypeScript
  js:    { Icon: SiJavascript,  color: "#F7DF1E" },
  mjs:   { Icon: SiJavascript,  color: "#F7DF1E" },
  cjs:   { Icon: SiJavascript,  color: "#F7DF1E" },
  jsx:   { Icon: SiReact,       color: "#61DAFB" },
  ts:    { Icon: SiTypescript,   color: "#3178C6" },
  tsx:   { Icon: SiReact,       color: "#61DAFB" },

  // Web
  html:  { Icon: SiHtml5,       color: "#E44D26" },
  htm:   { Icon: SiHtml5,       color: "#E44D26" },
  css:   { Icon: SiCss3,        color: "#1572B6" },
  scss:  { Icon: SiSass,        color: "#CD6799" },
  sass:  { Icon: SiSass,        color: "#CD6799" },
  less:  { Icon: SiCss3,        color: "#1D365D" },
  svg:   { Icon: SiSvg,         color: "#FFB13B" },
  vue:   { Icon: SiVuedotjs,    color: "#4FC08D" },
  svelte:{ Icon: SiSvelte,      color: "#FF3E00" },

  // Data / Config
  json:  { Icon: SiJson,        color: "#FBC02D" },
  yaml:  { Icon: SiYaml,        color: "#CB171E" },
  yml:   { Icon: SiYaml,        color: "#CB171E" },
  toml:  { Icon: SiToml,        color: "#9C4121" },
  xml:   { Icon: VscFile,       color: "#E37933" },
  csv:   { Icon: VscFile,       color: "#89D185" },
  env:   { Icon: VscSettingsGear, color: "#ECD53F" },
  ini:   { Icon: VscSettingsGear, color: "#9B9B9B" },
  conf:  { Icon: VscSettingsGear, color: "#9B9B9B" },
  cfg:   { Icon: VscSettingsGear, color: "#9B9B9B" },

  // Markdown / Docs
  md:    { Icon: SiMarkdown,    color: "#519ABA" },
  mdx:   { Icon: SiMarkdown,    color: "#519ABA" },
  txt:   { Icon: VscFile,       color: "#CCCCCC" },
  rst:   { Icon: VscFile,       color: "#CCCCCC" },
  log:   { Icon: VscFile,       color: "#7A7A7A" },

  // Python
  py:    { Icon: SiPython,      color: "#3776AB" },
  pyw:   { Icon: SiPython,      color: "#3776AB" },
  pyx:   { Icon: SiPython,      color: "#3776AB" },
  ipynb: { Icon: SiPython,      color: "#F37726" },

  // JVM
  java:  { Icon: DiJava,        color: "#E76F00" },
  kt:    { Icon: SiKotlin,      color: "#7F52FF" },
  kts:   { Icon: SiKotlin,      color: "#7F52FF" },
  scala: { Icon: SiScala,       color: "#DC322F" },
  clj:   { Icon: SiClojure,     color: "#5881D8" },

  // Systems
  c:     { Icon: SiC,           color: "#A8B9CC" },
  h:     { Icon: SiC,           color: "#A8B9CC" },
  cpp:   { Icon: SiCplusplus,   color: "#00599C" },
  hpp:   { Icon: SiCplusplus,   color: "#00599C" },
  cc:    { Icon: SiCplusplus,   color: "#00599C" },
  cxx:   { Icon: SiCplusplus,   color: "#00599C" },
  cs:    { Icon: SiDotnet,      color: "#239120" },
  rs:    { Icon: SiRust,        color: "#DEA584" },
  go:    { Icon: SiGo,          color: "#00ADD8" },
  zig:   { Icon: SiZig,         color: "#F7A41D" },
  swift: { Icon: SiSwift,       color: "#F05138" },
  dart:  { Icon: SiDart,        color: "#0175C2" },

  // Scripting
  rb:    { Icon: SiRuby,        color: "#CC342D" },
  php:   { Icon: SiPhp,         color: "#8993BE" },
  pl:    { Icon: SiPerl,        color: "#39457E" },
  pm:    { Icon: SiPerl,        color: "#39457E" },
  lua:   { Icon: SiLua,         color: "#2C2D72" },
  r:     { Icon: SiR,           color: "#276DC3" },
  R:     { Icon: SiR,           color: "#276DC3" },
  ex:    { Icon: SiElixir,      color: "#6E4A7E" },
  exs:   { Icon: SiElixir,      color: "#6E4A7E" },
  hs:    { Icon: SiHaskell,     color: "#5D4F85" },

  // Shell
  sh:    { Icon: SiGnubash,     color: "#4EAA25" },
  bash:  { Icon: SiGnubash,     color: "#4EAA25" },
  zsh:   { Icon: SiGnubash,     color: "#4EAA25" },
  fish:  { Icon: SiGnubash,     color: "#4EAA25" },
  bat:   { Icon: VscTerminalBash, color: "#C1F12E" },
  cmd:   { Icon: VscTerminalBash, color: "#C1F12E" },
  ps1:   { Icon: VscTerminalBash, color: "#012456" },

  // Query / API
  sql:   { Icon: VscDatabase,   color: "#E38C00" },
  graphql: { Icon: SiGraphql,   color: "#E10098" },
  gql:   { Icon: SiGraphql,     color: "#E10098" },
  prisma:{ Icon: VscDatabase,   color: "#2D3748" },

  // Docker
  dockerfile: { Icon: SiDocker, color: "#2496ED" },

  // Git
  gitignore:  { Icon: SiGit,    color: "#F05032" },
  gitmodules: { Icon: SiGit,    color: "#F05032" },
  gitattributes: { Icon: SiGit, color: "#F05032" },

  // Media
  png:   { Icon: VscFileMedia,  color: "#A074C4" },
  jpg:   { Icon: VscFileMedia,  color: "#A074C4" },
  jpeg:  { Icon: VscFileMedia,  color: "#A074C4" },
  gif:   { Icon: VscFileMedia,  color: "#A074C4" },
  webp:  { Icon: VscFileMedia,  color: "#A074C4" },
  ico:   { Icon: VscFileMedia,  color: "#A074C4" },
  bmp:   { Icon: VscFileMedia,  color: "#A074C4" },

  // Archives
  zip:   { Icon: VscFileZip,    color: "#E5A00D" },
  tar:   { Icon: VscFileZip,    color: "#E5A00D" },
  gz:    { Icon: VscFileZip,    color: "#E5A00D" },
  rar:   { Icon: VscFileZip,    color: "#E5A00D" },
  "7z":  { Icon: VscFileZip,    color: "#E5A00D" },

  // Documents
  pdf:   { Icon: VscFilePdf,    color: "#FF2116" },

  // Lock files
  lock:  { Icon: VscLock,       color: "#E5A00D" },

  // Misc
  wasm:  { Icon: VscFile,       color: "#654FF0" },
  map:   { Icon: VscFile,       color: "#F5DE19" },
};

// ── Special filename matches (checked before extension) ──────

const FILENAME_MAP = {
  "Dockerfile":      { Icon: SiDocker,        color: "#2496ED" },
  "docker-compose.yml":  { Icon: SiDocker,    color: "#2496ED" },
  "docker-compose.yaml": { Icon: SiDocker,    color: "#2496ED" },
  ".dockerignore":   { Icon: SiDocker,        color: "#2496ED" },
  "Makefile":        { Icon: VscTerminalBash, color: "#6D8086" },
  "CMakeLists.txt":  { Icon: VscTerminalBash, color: "#6D8086" },
  ".gitignore":      { Icon: SiGit,           color: "#F05032" },
  ".gitmodules":     { Icon: SiGit,           color: "#F05032" },
  ".gitattributes":  { Icon: SiGit,           color: "#F05032" },
  ".env":            { Icon: VscSettingsGear,  color: "#ECD53F" },
  ".env.local":      { Icon: VscSettingsGear,  color: "#ECD53F" },
  ".env.production": { Icon: VscSettingsGear,  color: "#ECD53F" },
  ".env.development":{ Icon: VscSettingsGear,  color: "#ECD53F" },
  "package.json":    { Icon: SiNpm,           color: "#CB3837" },
  "package-lock.json": { Icon: SiNpm,         color: "#CB3837" },
  ".npmrc":          { Icon: SiNpm,           color: "#CB3837" },
  "tsconfig.json":   { Icon: SiTypescript,    color: "#3178C6" },
  "jsconfig.json":   { Icon: SiJavascript,    color: "#F7DF1E" },
  ".eslintrc":       { Icon: VscSettingsGear,  color: "#4B32C3" },
  ".eslintrc.js":    { Icon: VscSettingsGear,  color: "#4B32C3" },
  ".eslintrc.json":  { Icon: VscSettingsGear,  color: "#4B32C3" },
  "eslint.config.js":{ Icon: VscSettingsGear,  color: "#4B32C3" },
  ".prettierrc":     { Icon: VscSettingsGear,  color: "#56B3B4" },
  "vite.config.js":  { Icon: VscSettingsGear,  color: "#646CFF" },
  "vite.config.ts":  { Icon: VscSettingsGear,  color: "#646CFF" },
  "webpack.config.js": { Icon: VscSettingsGear, color: "#8DD6F9" },
  "babel.config.js": { Icon: VscSettingsGear,  color: "#F9DC3E" },
  "LICENSE":         { Icon: VscFile,          color: "#D4AA00" },
  "README.md":       { Icon: SiMarkdown,      color: "#519ABA" },
};

// ── Public API ───────────────────────────────────────────────

export function getFileIcon(filename) {
  // 1. Check full filename first (for Dockerfile, .gitignore, etc.)
  const byName = FILENAME_MAP[filename];
  if (byName) {
    const { Icon, color } = byName;
    return <Icon size={ICON_SIZE} color={color} style={{ flexShrink: 0 }} />;
  }

  // 2. Extract extension
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex > 0) {
    const ext = filename.slice(dotIndex + 1).toLowerCase();
    const byExt = EXTENSION_MAP[ext];
    if (byExt) {
      const { Icon, color } = byExt;
      return <Icon size={ICON_SIZE} color={color} style={{ flexShrink: 0 }} />;
    }
  }

  // 3. Fallback — generic file icon
  return <VscFile size={ICON_SIZE} color="#9CDCFE" style={{ flexShrink: 0 }} />;
}
