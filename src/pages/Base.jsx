import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Base.css'
import StartMenu from '../components/StartMenu'
import Taskbar from '../components/Taskbar'
import WelcomeCard from '../components/WelcomeCard'
import NameModal from '../components/NameModal'

export default function Base() {
    const canvasRef = useRef(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const ripplesRef = useRef([])
    const animationFrameRef = useRef(null)
    const navigate = useNavigate()

    const [activeWindow, setActiveWindow] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [windowPos, setWindowPos] = useState({ x: 0, y: 0 })
    const [startMenuOpen, setStartMenuOpen] = useState(false)
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
    const [showNameModal, setShowNameModal] = useState(false)


    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const dragStartRef = useRef({ x: 0, y: 0 })
    const windowRef = useRef(null)

    const clampWindowPos = (pos) => {
        const maxX = window.innerWidth - 300
        const maxY = window.innerHeight - 150
        return {
            x: Math.min(Math.max(pos.x, 0), maxX),
            y: Math.min(Math.max(pos.y, 0), maxY)
        }
    }


    const handleWindowDragStart = (e) => {
        if (e.target.closest('.window-controls')) return;
        setIsDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        dragStartRef.current = { x: clientX, y: clientY };
        e.preventDefault();
        e.stopPropagation();
    };

    const handleWindowDragEnd = () => {
        setIsDragging(false)
    }

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    const closeWelcome = () => {
        setShowWelcome(false)
        localStorage.setItem('welcomeSeen', 'true')
    }

    const [userName, setUserName] = useState(() => {
        return localStorage.getItem('userName') || 'User'
    })

    const openNameModal = () => setShowNameModal(true)
    const closeNameModal = () => setShowNameModal(false)
    const updateUserName = (newName) => {
        setUserName(newName)
        localStorage.setItem('userName', newName)
    }

    const [showWelcome, setShowWelcome] = useState(() => {
        const hasSeen = localStorage.getItem('welcomeSeen')
        return !hasSeen  // true jika belum pernah lihat
    })

    const saveUserName = (name) => {
        setUserName(name)
        localStorage.setItem('userName', name)
        localStorage.setItem('welcomeSeen', 'true')
        setShowWelcome(false)
    }

    class Ripple {
        constructor(x, y) {
            this.x = x
            this.y = y
            this.radius = 0
            this.maxRadius = 100
            this.opacity = 0.5
            this.speed = 1.5
            this.fadeSpeed = 0.008
        }
        update() {
            this.radius += this.speed
            this.opacity -= this.fadeSpeed
            return this.opacity > 0 && this.radius < this.maxRadius
        }
        draw(ctx) {
            const rippleRGB = getComputedStyle(document.documentElement)
                .getPropertyValue('--ripple-color').trim()
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(${rippleRGB}, ${this.opacity * 0.3})`
            ctx.lineWidth = 1.5
            ctx.stroke()
        }
    }
    useEffect(() => {
        if (!isDragging) return;

        const handleGlobalMove = (e) => {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const dx = clientX - dragStartRef.current.x;
            const dy = clientY - dragStartRef.current.y;
            setWindowPos(prev => clampWindowPos({ x: prev.x + dx, y: prev.y + dy }));
            dragStartRef.current = { x: clientX, y: clientY };
        };

        const handleGlobalEnd = () => {
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('mouseup', handleGlobalEnd);
        window.addEventListener('touchmove', handleGlobalMove, { passive: false });
        window.addEventListener('touchend', handleGlobalEnd);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalEnd);
            window.removeEventListener('touchmove', handleGlobalMove);
            window.removeEventListener('touchend', handleGlobalEnd);
        };
    }, [isDragging, setWindowPos, clampWindowPos, dragStartRef]);

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        const drawGrid = (ctx, width, height) => {
            const gridSize = 40
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
            ctx.lineWidth = 0.5
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath()
                ctx.moveTo(x, 0)
                ctx.lineTo(x, height)
                ctx.stroke()
            }
            for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(width, y)
                ctx.stroke()
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            drawGrid(ctx, canvas.width, canvas.height)
            ripplesRef.current = ripplesRef.current.filter(ripple => {
                const isAlive = ripple.update()
                if (isAlive) ripple.draw(ctx)
                return isAlive
            })
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e) => {
            const now = Date.now()
            if (!mouseRef.current.lastRippleTime || now - mouseRef.current.lastRippleTime > 50) {
                ripplesRef.current.push(new Ripple(e.clientX, e.clientY))
                mouseRef.current.lastRippleTime = now
            }
        }

        const handleMouseClick = (e) => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    ripplesRef.current.push(new Ripple(e.clientX, e.clientY))
                }, i * 30)
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        animate()

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('click', handleMouseClick)
        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('click', handleMouseClick)
            window.removeEventListener('mouseup', handleMouseUp)
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        }
    }, [])

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

    const closeWindow = () => {
        setActiveWindow(null)
    }

    const toggleStartMenu = () => setStartMenuOpen(prev => !prev)


    const socialLinks = [
        { name: 'GitHub', icon: 'bi-github', url: 'https://github.com/lotzbrenn' },
        { name: 'Facebook', icon: 'bi-facebook', url: 'https://facebook.com/lotzbrenn' },
        { name: 'Twitter', icon: 'bi-twitter-x', url: 'https://twitter.com/lotzbrenn' },
        { name: 'Instagram', icon: 'bi-instagram', url: 'https://instagram.com/lotzbrenn' },
        { name: 'Discord', icon: 'bi-discord', url: 'https://discord.com/users/746300281465077830' }
    ]

    const desktopShortcuts = [
        { name: 'About', icon: 'bi-file-earmark-person-fill', action: 'about', navigateTo: '/about', description: 'About me' },
        { name: 'Socials', icon: 'bi-people-fill', action: 'socials', description: 'Connect with me' },
        { name: 'Projects', icon: 'bi-folder-fill', action: 'projects', description: 'My work' },
        { name: 'Contacts', icon: 'bi-envelope-fill', action: 'contacts', description: 'Get in touch' },
        { name: 'Mystery', icon: 'bi-gift-fill', action: 'coming-soon', description: '???' }
    ]

    const handleShortcutClick = (shortcut) => {
        if (shortcut.navigateTo) {
            navigate(shortcut.navigateTo)
            setStartMenuOpen(false)  // tutup start menu setelah navigasi
            if (activeWindow) setActiveWindow(null) // opsional: tutup window jika terbuka
        } else {
            openWindow(shortcut.action)
            setStartMenuOpen(false)
        }
    }

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
            case 'coming-soon':
                return (
                    <div className="window-content-coming-soon">
                        <div className="coming-soon-info">
                            <i className="bi bi-stars"></i>
                            <h3>Coming Soon</h3>
                            <p>Something exciting is brewing...</p>
                            <div className="mystery-box">
                                <i className="bi bi-gift"></i>
                                <span>Stay tuned!</span>
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <>
            {showWelcome && <WelcomeCard onSave={saveUserName} />}
            <canvas ref={canvasRef} className="base-canvas" />
            <div className="desktop-shortcuts">
                {desktopShortcuts.map((shortcut, index) => (
                    <button
                        key={index}
                        className="desktop-shortcut"
                        onClick={() => handleShortcutClick(shortcut)}
                        onDoubleClick={() => handleShortcutClick(shortcut)}
                        title={shortcut.description}
                    >
                        <div className="shortcut-icon">
                            <i className={`bi ${shortcut.icon}`}></i>
                        </div>
                        <span className="shortcut-name">{shortcut.name}</span>
                    </button>
                ))}
            </div>

            <Taskbar onStartClick={() => setStartMenuOpen(prev => !prev)} />

            {showNameModal && (
                <NameModal
                    currentName={userName}
                    onSave={updateUserName}
                    onClose={closeNameModal}
                />
            )}

            <StartMenu
                isOpen={startMenuOpen}
                onClose={() => setStartMenuOpen(false)}
                shortcuts={desktopShortcuts}
                onShortcutClick={handleShortcutClick}   // ← langsung tanpa arrow function
                theme={theme}
                onToggleTheme={toggleTheme}
                userName={userName}
                onChangeName={openNameModal}
            />

            {activeWindow && (
                <div ref={windowRef} className="system-window" style={{ left: `${windowPos.x}px`, top: `${windowPos.y}px` }}>
                    <div className="window-titlebar" onMouseDown={handleWindowDragStart} onTouchStart={handleWindowDragStart}>
                        <div className="window-title">
                            <i className={`bi ${activeWindow === 'socials' ? 'bi-people' : activeWindow === 'projects' ? 'bi-code-slash' : activeWindow === 'contacts' ? 'bi-envelope' : 'bi-question-circle'}`}></i>
                            <span>{activeWindow.charAt(0).toUpperCase() + activeWindow.slice(1)}</span>
                        </div>
                        <div className="window-controls">
                            <button className="window-close" onClick={closeWindow}><i className="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                    <div className="window-body">{renderWindowContent()}</div>
                </div>
            )}
        </>
    )
}