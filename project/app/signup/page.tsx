"use client"
import Navbar from "../components/Navbar"
import { signUp } from "@/auth/actions"
import { useState } from 'react'

export default function signup() {

    //TO-DO
    //ADD MORE USER RESPONSE: prompt the user for information they failed to provided by updating the form itself
    //make form look a bit better
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    async function submitHandler(submittedForm: React.FormEvent<HTMLFormElement>) {
        submittedForm.preventDefault()
        setError(null)
        setSuccess(null)
        const formData = new FormData(submittedForm.currentTarget)
        const errorCheck = await signUp(formData)
        if (errorCheck?.error)
            setError(errorCheck.error)
        else
            setSuccess(errorCheck.success ?? null)
    }

    return (
        <div>
            <div className="mb-20">
                <Navbar />
            </div>

            <div className="flex flex-col gap-9 w-1/3 bg-red-200/50 mx-auto min-h-128 backdrop-blur-sm">
                <h1 className="text-center text-2xl">Already a member? Sign in</h1>
                <form onSubmit={submitHandler} className="flex flex-col gap-9">
                    <div className="flex flex-col px-24 rounded gap-4">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" className="bg-white" />

                        <label htmlFor="username">Username</label>
                        <input type="username" name="username" className="bg-white" />

                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" className="bg-white" />

                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" name="confirmPassword" className="bg-white" />
                    </div>

                    <button className="self-center bg-red-700 rounded-4xl mt-6 p-2.5 font-bold text-white uppercase w-full md:max-w-40 hover:bg-black transition-all duration-200 text-center" type="submit">Sign-Up</button>

                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-center text-sm">{success}</p>}
                </form>
            </div>
        </div>
    )
}