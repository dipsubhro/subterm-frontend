import React, { useEffect } from 'react';
import '../App.css';

const SHORTCUTS = {
  others: [
    { key: ['Ctrl', 'S'], description: 'Save file' },
    { key: ['Ctrl', 'Shift', 'S'], description: 'Save all' },
    { key: ['Ctrl', 'P'], description: 'File search' },
    { key: ['Ctrl', 'Shift', 'P'], description: 'Command palette' },
    { key: ['Ctrl', '`'], description: 'Toggle terminal' },
    { key: ['Ctrl', 'B'], description: 'Toggle sidebar' },
  ],
  editing: [
    { key: ['Ctrl', '/'], description: 'Toggle comment' },
    { key: ['Alt', '↑/↓'], description: 'Move line' },
    { key: ['Shift', 'Alt', '↑/↓'], description: 'Duplicate line' },
    { key: ['Shift', 'Alt', 'F'], description: 'Format document' },
    { key: ['Shift', 'Alt', 'V'], description: 'Toggle validation' },
  ],
  navigation: [
    { key: ['Ctrl', 'G'], description: 'Go to line' },
    { key: ['Ctrl', 'F'], description: 'Find' },
    { key: ['Ctrl', 'H'], description: 'Replace' },
  ]
};

const ShortcutGroup = ({ title, items }) => (
  <div className="shortcut-group">
    <h3>{title}</h3>
    <div className="shortcut-list">
      {items.map((item, index) => (
        <div key={index} className="shortcut-item">
          <div className="shortcut-meta">
            <span className="shortcut-desc">{item.description}</span>
          </div>
          <div className="shortcut-keys">
            {item.key.map((k, i) => (
              <React.Fragment key={i}>
                <kbd>{k}</kbd>
                {i < item.key.length - 1 && <span className="plus">+</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ShortcutsModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling on body when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div 
        className="shortcuts-modal" 
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="shortcuts-header">
          <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="shortcuts-content">
          <ShortcutGroup title="Core" items={SHORTCUTS.others} />
          <ShortcutGroup title="Editing" items={SHORTCUTS.editing} />
          <ShortcutGroup title="Navigation" items={SHORTCUTS.navigation} />
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
