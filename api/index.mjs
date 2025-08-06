import express from 'express'
import morgan from "morgan";
import {z} from "zod";
import formData from 'form-data'
import Mailgun from 'mailgun.js'
import 'dotenv/config'

// configure mailgun to be able to send emails
const mailgun = new Mailgun(formData)
const mailgunClient = mailgun.client({username:'api', key: process.env["MAILGUN_API_KEY"]})

// get access to the express object to initialize express
const app = express()

// register morgan as a middleware with Express
// middleware allows for modifying incoming requests and customizes our responses
app.use(morgan('dev'))

// setup express to use json responses and parse json requests
app.use(express.json())

// create a router so that we can have custom paths for different resources in our application
const indexRoute = express.Router()

// create a simple get handler to help with CORS later on
const getRouterHandler = (request, response) => {
    return response.json('this thing is on')
}

const postRouteHandler = async (request, response) => {
    response.header('Access-Control-Allow-Origin', '*')
    const schema = z.object({
        name: z.string({required_error: 'name is a required field'})
            .min(1, {message: 'name must consist of at least 1 character'})
            .max(64, {message: 'name must be under 64 characters'})
            .trim()
            .transform(val => val.replace(/<[^>]*>/g, '')),
        email: z.string({required_error: 'email is a required field'})
            .email(1, {message: 'invalid email address'})
            .max(128, {message: 'email must be under 64 characters'})
            .trim()
            .transform(val => val.replace(/<[^>]*>/g, '')),
        subject: z.string()
            .max(64, {message: 'subject must be under 64 characters'})
            .trim()
            .transform(val => val.replace(/<[^>]*>/g, ''))
            .optional(),
        message: z.string({required_error: 'message is a required field'})
            .min(1, {message: 'message must consist of at least 1 character'})
            .max(500, {message: 'message cannot exceed 500 characters'})
            .trim()
            .transform(val => val.replace(/<[^>]*>/g, ''))
    })

    const result = schema.safeParse(request.body)

    if (result.error) {
        return response.json({status: 418, message: result.error.issues[0].message})
    }

    // if the honeypot was touched, send a fake message
    if (request.body.website !== "") {
        return response.json({status:201, message: 'email sent successfully'})
    }

    try {
        // a try-catch lets the program keep going if an error is encountered
        const subject = result.data.subject ?? undefined
        const mailgunMessage = {
            from: `<postmaster@${process.env.MAILGUN_DOMAIN}>`,
            subject,
            text: `from ${result.data.email}
            ${result.data.message},
            `,
            to: process.env.MAILGUN_RECIPIENT
        }

        await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, mailgunMessage)
        return response.json({status: 200, message:"email sent successfully"})

    } catch (error) {
        console.error(error)
        return response.json({status:500, message: 'internal server error'})
    }
}

indexRoute.route('/')
    .get(getRouterHandler)
    .post(postRouteHandler)

app.use('/apis', indexRoute)

app.listen(4200, () => {
    console.log('server is running')
})