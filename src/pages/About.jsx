import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'  // tambahkan
import Taskbar from '../components/Taskbar'
import StartMenu from '../components/StartMenu'

export default function About() {
    const navigate = useNavigate()  // tambahkan
    const [startMenuOpen, setStartMenuOpen] = useState(false)
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

    const shortcuts = [
        { name: 'About', icon: 'bi-file-earmark-person-fill', action: 'about', navigateTo: '/about' },
        { name: 'Socials', icon: 'bi-people-fill', action: 'socials' },
        { name: 'Projects', icon: 'bi-folder-fill', action: 'projects' },
        { name: 'Contacts', icon: 'bi-envelope-fill', action: 'contacts' },
        { name: 'Mystery', icon: 'bi-gift-fill', action: 'coming-soon' }
    ]

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

    // Handler yang menerima object shortcut
    const handleShortcutClick = (shortcut) => {
        if (shortcut.navigateTo) {
            navigate(shortcut.navigateTo)
            setStartMenuOpen(false)
        } else {
            alert(`Open ${shortcut.action} (coming soon)`)
            setStartMenuOpen(false)
        }
    }

    return (
        <div style={{ background: 'var(--bg-primary)', height: '100vh', paddingTop: '20px', color: 'var(--text-primary)' }}>
            <h1>About Page</h1>
            <p>This is another page. Taskbar and Start Menu are reusable.</p>
            <Taskbar onStartClick={() => setStartMenuOpen(prev => !prev)} />
            <StartMenu
                isOpen={startMenuOpen}
                onClose={() => setStartMenuOpen(false)}
                shortcuts={shortcuts}
                onShortcutClick={handleShortcutClick}
                theme={theme}
                onToggleTheme={toggleTheme}
            />
        </div>
    )
}