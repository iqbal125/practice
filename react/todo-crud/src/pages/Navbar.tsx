import { useState } from "react";


function NavBar() {
    const [activeItem, setActiveItem] = useState(null);

    const handleClick = (item) => {
        // TODO: update active item
        // TODO: invoke callback
    };

    return (
        <nav className="navbar">
            <ul className="nav-list">
                {/* TODO: render nav items */}
            </ul>
        </nav>
    );
}

export default NavBar;
