// src/components/Taskbar.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Taskbar({ onStartClick, onSettingsClick }) {
    const navigate = useNavigate()

    const handleHomeClick = () => {
        navigate('/')
    }

    return (
        <div className="taskbar">
            <div className="taskbar-left">
                <button className="taskbar-btn" onClick={onStartClick}>
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                </button>
                <button className="taskbar-btn taskbar-home" onClick={handleHomeClick}>
                    <i className="bi bi-house-door-fill"></i>
                </button>
                <button className="taskbar-btn" onClick={onSettingsClick}>
                    <i className="bi bi-gear-fill"></i>
                </button>
            </div>
            <div className="taskbar-right">
                <span className="taskbar-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    )
}