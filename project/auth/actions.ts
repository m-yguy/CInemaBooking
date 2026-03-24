"use server"
import { neon } from '@neondatabase/serverless'
import bcrypt from "bcrypt"


export async function signUp(formData: FormData) {
    console.log("signup called")
    const email = formData.get("email")
    const userName = formData.get("username")
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    //Check to see if form is working
    //console.log(`The email is ${email} the username is ${userName} the password is ${password} the confirmPassword is ${confirmPassword}`)

    

    const sql = neon(process.env.DATABASE_URL!)

    // validation process
    if (password !== confirmPassword)
        return { error: "Passwords don't match" }

    const checkUser = await sql`SELECT * FROM users WHERE email = ${email}`
    if (checkUser.length > 0)
        return{error: "The Email is already in use"}

    // hash + enter into database
     const hashPass = await bcrypt.hash(password, 15)
    await sql`
    INSERT INTO users(username, email, password, user_type)
    VALUES (${userName}, ${email}, ${hashPass}, 'CUSTOMER')
    `

    console.log("Email inserted")
}