import { useEffect, useState } from "react";

function AutoSaveForm() {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [lastSaved, setLastSaved] = useState(null);

    useEffect(() => {
        const saveTimer = setInterval(() => {
            // Save to backend
            // saveFormData(formData).then(() => {
            //     setLastSaved(new Date().toLocaleTimeString());
            // });
        }, 30000);

        return () => clearInterval(saveTimer);
    }, [formData]);

    return (
        <form>
            {/* form fields */}
            {lastSaved && <p>Last saved: {lastSaved}</p>}
        </form>
    );
}