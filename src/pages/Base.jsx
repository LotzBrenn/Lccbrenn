import React, { useEffect, useRef, useState } from 'react'
import './Base.css'

export default function Base() {
    const canvasRef = useRef(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const ripplesRef = useRef([])
    const animationFrameRef = useRef(null)

    const [activeWindow, setActiveWindow] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [windowPos, setWindowPos] = useState({ x: 0, y: 0 })
    const dragStartRef = useRef({ x: 0, y: 0 })
    const windowRef = useRef(null)

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
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
                ctx.strokeStyle = `rgba(100, 200, 255, ${this.opacity * 0.3})`
                ctx.lineWidth = 1.5
                ctx.stroke()
            }
        }

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
                if (isAlive) {
                    ripple.draw(ctx)
                }
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

            if (isDragging) {
                const dx = e.clientX - dragStartRef.current.x
                const dy = e.clientY - dragStartRef.current.y
                setWindowPos(prev => ({
                    x: prev.x + dx,
                    y: prev.y + dy
                }))
                dragStartRef.current = { x: e.clientX, y: e.clientY }
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
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [isDragging, windowPos.x, windowPos.y]) // Fixed dependency array

    const handleWindowDragStart = (e) => {
        if (e.target.closest('.window-controls')) return
        setIsDragging(true)
        dragStartRef.current = { x: e.clientX, y: e.clientY }
    }

    const centerWindow = () => {
        const windowWidth = 500
        const windowHeight = 300
        setWindowPos({
            x: (window.innerWidth - windowWidth) / 2,
            y: (window.innerHeight - windowHeight) / 2
        })
    }

    const openWindow = (type) => {
        setActiveWindow(type)
        centerWindow()
    }

    const closeWindow = () => {
        setActiveWindow(null)
    }

    // Social media links
    const socialLinks = [
        { name: 'GitHub', icon: 'bi-github', url: 'https://github.com/lotzbrenn' },
        { name: 'Facebook', icon: 'bi-facebook', url: 'https://facebook.com/lotzbrenn' },
        { name: 'Twitter', icon: 'bi-twitter-x', url: 'https://twitter.com/lotzbrenn' },
        { name: 'Instagram', icon: 'bi-instagram', url: 'https://instagram.com/lotzbrenn' },
        { name: 'Discord', icon: 'bi-discord', url: 'https://discord.com/users/746300281465077830' }
    ]

    // Desktop shortcuts data
    const desktopShortcuts = [
        {
            name: 'Socials',
            icon: 'bi-people-fill',
            action: 'socials',
            description: 'Connect with me'
        },
        {
            name: 'Projects',
            icon: 'bi-folder-fill',
            action: 'projects',
            description: 'My work'
        },
        {
            name: 'Contacts',
            icon: 'bi-envelope-fill',
            action: 'contacts',
            description: 'Get in touch'
        },
        {
            name: 'Mystery',
            icon: 'bi-gift-fill',
            action: 'coming-soon',
            description: '???'
        }
    ]

    const renderWindowContent = () => {
        switch (activeWindow) {
            case 'socials':
                return (
                    <div className="window-content-socials">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                            >
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
                            <a
                                href="https://github.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="visit-btn"
                            >
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
            <canvas
                ref={canvasRef}
                className="base-canvas"
            />

            {/* Desktop Shortcuts - Area Kiri */}
            <div className="desktop-shortcuts">
                {desktopShortcuts.map((shortcut, index) => (
                    <button
                        key={index}
                        className="desktop-shortcut"
                        onClick={() => openWindow(shortcut.action)}
                        onDoubleClick={() => openWindow(shortcut.action)}
                        title={shortcut.description}
                    >
                        <div className="shortcut-icon">
                            <i className={`bi ${shortcut.icon}`}></i>
                        </div>
                        <span className="shortcut-name">{shortcut.name}</span>
                    </button>
                ))}
            </div>

            {/* Taskbar - Bawah */}
            <div className="taskbar">
                <div className="taskbar-left">
                    <button className="taskbar-btn">
                        <i className="bi bi-grid-3x3-gap-fill"></i>
                    </button>
                </div>

                {/* <div className="taskbar-center">
                    {desktopShortcuts.map((shortcut, index) => (
                        <button
                            key={index}
                            className={`taskbar-shortcut ${activeWindow === shortcut.action ? 'active' : ''}`}
                            onClick={() => openWindow(shortcut.action)}
                            title={shortcut.description}
                        >
                            <i className={`bi ${shortcut.icon}`}></i>
                        </button>
                    ))}
                </div> */}

                <div className="taskbar-right">
                    <span className="taskbar-time">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* Modal Window */}
            {activeWindow && (
                <div
                    ref={windowRef}
                    className="system-window"
                    style={{
                        left: `${windowPos.x}px`,
                        top: `${windowPos.y}px`
                    }}
                >
                    <div
                        className="window-titlebar"
                        onMouseDown={handleWindowDragStart}
                    >
                        <div className="window-title">
                            <i className={`bi ${activeWindow === 'socials' ? 'bi-people' :
                                activeWindow === 'projects' ? 'bi-code-slash' :
                                    activeWindow === 'contacts' ? 'bi-envelope' :
                                        'bi-question-circle'}`}></i>
                            <span>{activeWindow.charAt(0).toUpperCase() + activeWindow.slice(1)}</span>
                        </div>
                        <div className="window-controls">
                            <button className="window-close" onClick={closeWindow}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>

                    <div className="window-body">
                        {renderWindowContent()}
                    </div>
                </div>
            )}
        </>
    )
}