import { useEffect } from "react"

export const Callback = () => {
    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(window.location.hash.substring(1));
                const jwtToken = params.get('id_token');
                if (!jwtToken) {
                    throw Error("jwtToken is null");
                }
                sessionStorage.setItem('sui_jwt_token', jwtToken);
                window.location.href = '/app'
            } catch (error) {
                console.error('error in handleCallback: ', error)
            }
        }
        handleCallback();
    }, []);

    return (
        <div>
            <p>handling oauth callback...</p>
        </div>
    )
}