import React, { useState } from 'react'

export default function NameModal({ currentName, onSave, onClose }) {
    const [name, setName] = useState(currentName)

    const handleSubmit = (e) => {
        e.preventDefault()
        const finalName = name.trim() === '' ? 'User' : name.trim()
        onSave(finalName)
        onClose()
    }

    return (
        <div className="welcome-card-overlay">
            <div className="welcome-card">
                <button className="welcome-close" onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </button>
                <div className="welcome-icon">
                    <i className="bi bi-pencil-square"></i>
                </div>
                <h2>Change Your Name</h2>
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
                        Save
                    </button>
                </form>
            </div>
        </div>
    )
}