"use server"
import { neon } from '@neondatabase/serverless'
import sgMail from '@sendgrid/mail'
import bcrypt from "bcrypt"
import crypto from "crypto"

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function signUp(formData: FormData) {
    const sqlManager = neon(process.env.DATABASE_URL!)
    const email = String(formData.get("email"))
    const userName = String(formData.get("username"))
    const password = String(formData.get("password"))
    const confirmPassword = String(formData.get("confirmPassword"))
    const verificiationKey = await bcrypt.genSalt(32)

    if (!email || !userName || !password || !confirmPassword)
        return { error: "Please fill out all sections of the form" }

    // validation process
    if (password !== confirmPassword)
        return { error: "Passwords don't match" }

    const checkUser = await sqlManager`SELECT * FROM users WHERE email = ${email}`
    if (checkUser.length > 0)
        return { error: "The email is already in use" }

    // hash + enter into database
    const hashPass = await crypto.randomBytes(32).toString("hex")

    await sqlManager`
    INSERT INTO users(username, email, password, user_type,verified, verification_key)
    VALUES (${userName}, ${email}, ${hashPass}, 'CUSTOMER', false, ${verificiationKey})
    `

    // Sending out verification email
    await sgMail.send({
        to: email,
        from: "cinemabookingsystemxyz@gmail.com",
        templateId: `d-ccc0d92738fc40999081974c0dee0aaf`,
        dynamicTemplateData: {
            verifyUrl: `http://localhost:3000/verificationPage?key=${verificiationKey}`,
            username: userName,
        },
    })
    return{success: "Verification email sent"}
}

export async function verifyEmail(key: string) {
    const sqlManager = neon(process.env.DATABASE_URL!)
    
    await sqlManager`UPDATE users SET verified = true, verification_key = NULL WHERE verification_key = ${key}`
    
    return { success: "Email verified! You can now log in." }
}