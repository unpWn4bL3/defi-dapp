import React from "react"
import { AuthService } from "../services/authService"

interface LoginButtonProps {
    onClick: () => void
}

export const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
    const authenticated = AuthService.isAuthenticated()
    return (
        <>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={onClick}
                disabled={authenticated}>
                {authenticated ? 'Logged in' : 'Log in with Google'}
            </button>
        </>
    )
}