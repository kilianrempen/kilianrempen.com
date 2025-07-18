import {z} from 'zod'

export function contactForm() {
    const schema = z.object({
        name: z.string({required_error: 'name is a required field'})
            .min(1, {message:'name must consist of at least 1 character'})
            .max(64, {message:'name must be under 64 characters'}),
        email: z.string({required_error: 'email is a required field'})
            .email(1, {message:'invalid email address'})
            .max(128 , {message:'email must be under 64 characters'}),
        subject: z.string()
            .max(64, {message:'subject must be under 64 characters'})
            .optional(),
        message: z.string({required_error: 'message is a required field'})
            .min(1, {message:'message must consist of at least 1 character'})
            .max(500, {message:'message cannot exceed 500 characters'}),
        website: z.string().optional()
    })
    // grab the form and convert it to a form-data object, and add an event listener for the submit event.
    const form = document.getElementById('contact-form')

    // grab the required input fields so that a red border can be added/removed if an error occurs
    const nameInput = document.getElementById('name')
    const emailInput = document.getElementById('email')
    const messageInput = document.getElementById('message')
    const subjectInput = document.getElementById('subject')

    // grab the error display elements to display error messages if necessary
    const nameInputError = document.getElementById('nameError')
    const emailInputError = document.getElementById('emailError')
    const messageInputError = document.getElementById('messageError')
    const subjectInputError = document.getElementById('subjectError')

    // grab the status output element to show a success message or backend error message
    const statusOutput = document.getElementById('status')

    // define success and error classes to give user a quick visual hint if the request succeeded/failed
    const successClasses = ['text-green-800', 'bg-green-50']
    const failedClasses = ['text-red-800', 'bg-red-50']

    // define what happens onSubmit
    form.addEventListener('submit', event => {
        event.preventDefault()

        // create an object from the form using the form data
        const formData = new FormData(form)

        const errorArray = [nameInputError, emailInputError, messageInputError, subjectInputError]
        errorArray.forEach(element => {element.classList.add('hidden')})

        const inputArray = [nameInput, emailInput, messageInput, subjectInput]
        inputArray.forEach(input => {input.classList.remove('border-red-500')})

        // if the website input is set, a bot most likely filled out the form, so provide a fake success message to trick the bot into thinking it succeeded.

        if (formData.get('website') !== '') {
            form.reset()
            statusOutput.innerHTML = 'message sent successfully'
            statusOutput.classList.add(...successClasses)
            statusOutput.classList.remove('hidden')
            return
        }

        // convert formData into an object so that validation can be performed
        const values = Object.fromEntries(formData.entries())

        // if subject is an empty string, set it to undefined
        values.subject = values.subject === '' ? undefined : values.subject

        // check for zod errors related to validating inputs and provide feedback to users if an error occurred
        const result = schema.safeParse(values)

        if (result.success === false) {
            const errorsMap = {
                name: {inputError: nameInput, errorElement: nameError},
                email: {inputError: emailInput, errorElement:emailError},
                message: {inputError: messageInput, errorElement:messageError},
                subject: {subjectError: subjectInput, errorElement:subjectError},
            }
            result.error.errors.forEach(error => {
                const {errorElement, inputError} = errorsMap[error.path[0]]
                errorElement.innerHTML = error.message
                errorElement.classList.remove('hidden')
                inputError.classList.add('border-red-500')
            })
            return
        }
        fetch('http://localhost:4200/api', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
        })  .then(response => response.json())
            .then(data => {
                statusOutput.innerHTML = data.message
                if (data.status === 200) {
                    statusOutput.classList.add(...successClasses)
                    form.reset()
                }
                statusOutput.classList.add(...failedClasses)
            })
    })
}