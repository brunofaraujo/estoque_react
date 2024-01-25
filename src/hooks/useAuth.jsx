import { useState } from "react";

const useAuth = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [cancelled, setCancelled] = useState(false);

    function checkIfIsCancelled() {
        if (cancelled) {
            return
        }
    }

    return ( <></> );
}
 
export default useAuth;