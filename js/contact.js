// js/contact.js

// EmailJS credentials — replace with your own if rotating keys
const EMAILJS_PUBLIC_KEY  = '7w5wyCyBbBaZQXbyn'
const EMAILJS_SERVICE_ID  = 'service_e8qv9cq'
const EMAILJS_TEMPLATE_ID = 'template_wfrb1u9'

emailjs.init(EMAILJS_PUBLIC_KEY)

const form      = document.getElementById('contact-form')
const feedback  = document.getElementById('form--feedback')
const submitBtn = document.getElementById('form-submit')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    // reset feedback state
    feedback.className = 'form--feedback'
    feedback.textContent = ''

    // =====================
    // HONEYPOT CHECK
    // =====================

    if (document.getElementById('honeypot').value) return

    // =====================
    // GET + VALIDATE FORM VALUES
    // =====================

    const name    = document.getElementById('contact-name').value.trim()
    const email   = document.getElementById('contact-email').value.trim()
    const message = document.getElementById('contact-message').value.trim()

    if (!name || !email || !message) {
        showFeedback('Please fill in all fields.', 'error')
        return
    }

    if (!isValidEmail(email)) {
        showFeedback('Please enter a valid email address.', 'error')
        return
    }

    // =====================
    // SEND EMAIL
    // =====================

    submitBtn.textContent = 'Sending...'
    submitBtn.disabled = true

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { name, email, message })
        .then(() => {
            showFeedback("Message sent! We'll get back to you soon.", 'success')
            form.reset()
        })
        .catch((err) => {
            console.error('EmailJS error:', err)
            showFeedback('Something went wrong. Please try again.', 'error')
        })
        .finally(() => {
            submitBtn.textContent = 'Submit'
            submitBtn.disabled = false
        })
})

// =====================
// HELPERS
// =====================

function showFeedback(message, type) {
    feedback.textContent = message
    feedback.className = `form--feedback ${type}`
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}