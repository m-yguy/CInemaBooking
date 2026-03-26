"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { verifyEmail } from "@/auth/actions"
import Navbar from "../components/Navbar"

export default function verificationPage() {
    const searchParams = useSearchParams()
    const key = searchParams.get("key")
    const [message, setMessage] = useState("Verifying...")
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (!key) {
            setMessage("No verification key found.")
            setIsError(true)
            return
        }

        verifyEmail(key).then((result) => {
                setMessage(result.success)
        })
    }, [key])

    return (
        <div>
            <Navbar/>
            <div className="flex flex-col items-center justify-center min-h-100">
                <div className="bg-gray-200 p-10 rounded text-center">
                    <p className={isError ? "text-red-500" : "text-green-500"}>
                        {message}
                    </p>
                </div>
            </div>
        </div>
    )
}