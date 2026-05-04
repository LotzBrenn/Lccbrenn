import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Taskbar from '../components/Taskbar'
import StartMenu from '../components/StartMenu'
import NameModal from '../components/NameModal'
// import './About.css'  // optional, bisa pakai Base.css juga

export default function About() {
    const navigate = useNavigate()
    const [startMenuOpen, setStartMenuOpen] = useState(false)
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'User')
    const [showNameModal, setShowNameModal] = useState(false)
    
    // State untuk window
    const [activeWindow, setActiveWindow] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [windowPos, setWindowPos] = useState({ x: 0, y: 0 })
    const dragStartRef = { current: { x: 0, y: 0 } }
    const windowRef = React.useRef(null)

    // Data konten (sama seperti Base)
    const socialLinks = [
        { name: 'GitHub', icon: 'bi-github', url: 'https://github.com/lotzbrenn' },
        { name: 'Facebook', icon: 'bi-facebook', url: 'https://facebook.com/lotzbrenn' },
        { name: 'Twitter', icon: 'bi-twitter-x', url: 'https://twitter.com/lotzbrenn' },
        { name: 'Instagram', icon: 'bi-instagram', url: 'https://instagram.com/lotzbrenn' },
        { name: 'Discord', icon: 'bi-discord', url: 'https://discord.com/users/746300281465077830' }
    ]

    const shortcuts = [
        { name: 'About', icon: 'bi-file-earmark-person-fill', action: 'about', navigateTo: '/about' },
        { name: 'Socials', icon: 'bi-people-fill', action: 'socials' },
        { name: 'Projects', icon: 'bi-folder-fill', action: 'projects' },
        { name: 'Contacts', icon: 'bi-envelope-fill', action: 'contacts' },
    ]

    // Fungsi window (salin dari Base)
    const clampWindowPos = (pos) => {
        const maxX = window.innerWidth - 300
        const maxY = window.innerHeight - 150
        return {
            x: Math.min(Math.max(pos.x, 0), maxX),
            y: Math.min(Math.max(pos.y, 0), maxY)
        }
    }

    const handleWindowDragStart = (e) => {
        if (e.target.closest('.window-controls')) return
        setIsDragging(true)
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const clientY = e.touches ? e.touches[0].clientY : e.clientY
        dragStartRef.current = { x: clientX, y: clientY }
        e.preventDefault()
    }

    const handleWindowDragMove = (e) => {
        if (!isDragging) return
        e.preventDefault()
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const clientY = e.touches ? e.touches[0].clientY : e.clientY
        const dx = clientX - dragStartRef.current.x
        const dy = clientY - dragStartRef.current.y
        setWindowPos(prev => clampWindowPos({ x: prev.x + dx, y: prev.y + dy }))
        dragStartRef.current = { x: clientX, y: clientY }
    }

    const handleWindowDragEnd = () => setIsDragging(false)

    const centerWindow = () => {
        const windowWidth = Math.min(500, window.innerWidth - 40)
        const windowHeight = 300
        setWindowPos(clampWindowPos({
            x: (window.innerWidth - windowWidth) / 2,
            y: (window.innerHeight - windowHeight) / 2
        }))
    }

    const openWindow = (type) => {
        setActiveWindow(type)
        centerWindow()
    }

    const closeWindow = () => setActiveWindow(null)

    // Handler shortcut (window untuk socials, projects, contacts)
    const handleShortcutClick = (shortcut) => {
        if (shortcut.navigateTo) {
            navigate(shortcut.navigateTo)
        } else if (shortcut.action === 'socials' || shortcut.action === 'projects' || shortcut.action === 'contacts') {
            openWindow(shortcut.action)
        } else {
            alert(`Open ${shortcut.action} (coming soon)`)
        }
        setStartMenuOpen(false)
    }

    // Render konten window
    const renderWindowContent = () => {
        switch (activeWindow) {
            case 'socials':
                return (
                    <div className="window-content-socials">
                        {socialLinks.map((social, index) => (
                            <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="social-link">
                                <i className={`bi ${social.icon}`}></i>
                                <span>{social.name}</span>
                            </a>
                        ))}
                    </div>
                )
            case 'projects':
                return (
                    <div className="window-content-projects">
                        <div className="project-info">
                            <i className="bi bi-folder2-open"></i>
                            <h3>My Projects</h3>
                            <p>Explore my projects and contributions on GitHub</p>
                            <a href="https://github.com/lotzbrenn" target="_blank" rel="noopener noreferrer" className="visit-btn">
                                <i className="bi bi-box-arrow-up-right"></i>
                                Visit GitHub Profile
                            </a>
                        </div>
                    </div>
                )
            case 'contacts':
                return (
                    <div className="window-content-contacts">
                        <div className="contact-info">
                            <i className="bi bi-envelope"></i>
                            <h3>Get In Touch</h3>
                            <p>This feature is coming soon!</p>
                            <div className="contact-placeholder">
                                <i className="bi bi-hourglass-split"></i>
                                <span>Email integration under development</span>
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        localStorage.setItem('userName', userName)
    }, [userName])

    const openNameModal = () => setShowNameModal(true)
    const closeNameModal = () => setShowNameModal(false)
    const updateUserName = (newName) => setUserName(newName)

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '20px', color: 'var(--text-primary)' }}>
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
                userName={userName}
                onChangeName={openNameModal}
            />
            {showNameModal && (
                <NameModal currentName={userName} onSave={updateUserName} onClose={closeNameModal} />
            )}

            {/* Window Modal */}
            {activeWindow && (
                <div ref={windowRef} className="system-window" style={{ left: `${windowPos.x}px`, top: `${windowPos.y}px` }}>
                    <div className="window-titlebar" onMouseDown={handleWindowDragStart} onTouchStart={handleWindowDragStart} onTouchMove={handleWindowDragMove} onTouchEnd={handleWindowDragEnd}>
                        <div className="window-title">
                            <i className={`bi ${activeWindow === 'socials' ? 'bi-people' : activeWindow === 'projects' ? 'bi-code-slash' : 'bi-envelope'}`}></i>
                            <span>{activeWindow.charAt(0).toUpperCase() + activeWindow.slice(1)}</span>
                        </div>
                        <div className="window-controls">
                            <button className="window-close" onClick={closeWindow}><i className="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                    <div className="window-body">{renderWindowContent()}</div>
                </div>
            )}
        </div>
    )
}