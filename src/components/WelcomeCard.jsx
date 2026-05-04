// src/components/WelcomeCard.jsx
import React, { useState } from 'react'

export default function WelcomeCard({ onSave }) {
    const [name, setName] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const finalName = name.trim() === '' ? 'User' : name.trim()
        onSave(finalName)
    }

    return (
        <div className="welcome-card-overlay">
            <div className="welcome-card">
                <div className="welcome-icon">
                    <i className="bi bi-stars"></i>
                </div>
                <h2>Welcome to My Portfolio</h2>
                <p>Please enter your name to personalize your experience:</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="welcome-input"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="welcome-button">
                        Get Started
                    </button>
                </form>
            </div>
        </div>
    )
}