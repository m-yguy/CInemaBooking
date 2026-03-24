import Navbar from "../components/Navbar"
import { signUp } from "@/auth/actions"


export default function signup() {

    //TO-DO
    //ADD MORE USER RESPONSE: prompt the user for information they failed to provided by updating the form itself
    //make form look a bit better
    return (
        <div>
            <div className="mb-20">
                <Navbar />
            </div>
            
            <div className="flex flex-col gap-9 container w-1/4 bg-gray-200 mx-auto min-h-128 rounded">
                <h1 className="text-center text-2xl">Sign-Up Form</h1>
                <form action={signUp} className="flex flex-col gap-9">
                    <div className="flex flex-col items-center rounded">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" className="bg-white" />
                    </div>

                    <div className="flex flex-col items-center rounded">
                        <label htmlFor="username">Username</label>
                        <input type="username" name="username" className="bg-white" />
                    </div>

                    <div className="flex flex-col items-center rounded">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" className="bg-white" />
                    </div>

                    <div className="flex flex-col items-center rounded">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" name="confirmPassword" className="bg-white" />
                    </div>
                    <button className="bg-white" type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    )
}