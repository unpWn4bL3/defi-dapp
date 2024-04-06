import React from "react"


interface LogoutButtonProps {
    onClick: () => void
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
    return (
        <>
            <button
                className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={onClick}>
                Logout
            </button>
        </>
    )
}