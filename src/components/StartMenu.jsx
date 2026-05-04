// src/components/StartMenu.jsx
import React, { useEffect, useRef } from 'react'

export default function StartMenu({ isOpen, onClose, shortcuts, onShortcutClick, theme, onToggleTheme, userName, onChangeName }) {
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.taskbar-btn')) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="start-menu" ref={menuRef}>
            <div className="start-menu-header">
                <i className="bi bi-person-circle"></i>
                <span>{userName}</span>
            </div>
            <div className="start-menu-grid">
                {shortcuts.map((shortcut, idx) => (
                    <button key={idx} className="start-menu-item" onClick={() => { onShortcutClick(shortcut); onClose() }}>
                        <i className={`bi ${shortcut.icon}`}></i>
                        <span>{shortcut.name}</span>
                    </button>
                ))}
                <button className="start-menu-item" onClick={() => { onToggleTheme() }}>
                    <i className={`bi ${theme === 'dark' ? 'bi-brightness-high-fill' : 'bi-moon-stars-fill'}`}></i>
                    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
                <button className="start-menu-item" onClick={() => { onChangeName(); onClose() }}>
                    <i className="bi bi-pencil-square"></i>
                    <span>Change Name</span>
                </button>
            </div>
        </div>
    )
}