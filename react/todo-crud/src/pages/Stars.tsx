import { useState } from "react";

export default function StarRating({ max = 5, onChange }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const handleClick = (value) => {
        const newValue = value === rating ? 0 : value;
        setRating(newValue);
        onChange?.(newValue);
    };

    return (
        <div style={{ display: "flex", gap: 8, fontSize: 30 }}>
            {Array.from({ length: max }, (_, i) => i + 1).map((value) => (
                <span
                    key={value}
                    onClick={() => handleClick(value)}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(0)}
                    style={{
                        cursor: "pointer",
                        color: (hover || rating) >= value ? "gold" : "#ccc",
                        transition: "0.2s"
                    }}
                >
                    ★
                </span>
            ))}
            <div style={{ marginLeft: 12 }}>{rating > 0 ? rating : ""}</div>
        </div>
    );
}

