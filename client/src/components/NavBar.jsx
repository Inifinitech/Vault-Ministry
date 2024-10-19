import React, { useState } from "react";
import "./styles/NavBar.css";

const Popover = ({ isVisible, content, onClose }) => {
    return (
        isVisible && (
            <div className="popover">
                <div className="popover-content">
                    {content}
                </div>
            </div>
        )
    );
};

const NavBar = ({ logoText, navItems }) => {
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [popoverContent, setPopoverContent] = useState("");

    const handlePopoverOpen = (content) => {
        setPopoverContent(content);
        setPopoverVisible(true);
    };

    const handlePopoverClose = () => {
        setPopoverVisible(false);
        setPopoverContent("");
    };

    return (
        <nav className="navbar">
            <div className="container-fluid">
                <h3 id="logo-text">{logoText}</h3>
                <div className="navbar-section" id="navbarNav">
                    <ul className="navbar-nav">
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                className="nav-item"
                                id={item.id}
                                onMouseEnter={() => handlePopoverOpen(item.popoverContent)}
                                onMouseLeave={handlePopoverClose}
                            >
                                {item.label}
                            </button>
                        ))}
                    </ul>
                </div>
                <Popover
                    isVisible={popoverVisible}
                    content={popoverContent}
                    onClose={handlePopoverClose}
                />
            </div>
        </nav>
    );
}

export default NavBar;
