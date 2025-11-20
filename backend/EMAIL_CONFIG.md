# Email Configuration

## Required Environment Variables

Add these to your `.env` file in `src/backend/`:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_actual_key_here
FROM_EMAIL=onboarding@resend.dev
```

## Verify Setup

1. **Check your `.env` file exists** in `src/backend/`
2. **Add your Resend API key** - Get it from https://resend.com
3. **Restart your server** after adding the API key

## Testing

After restarting the server, create a booking and check:

1. **Server Logs** - Should show: `✅ Booking confirmation email sent: [email-id]`
2. **Email Inbox** - Check batrudin10@gmail.com (also check spam folder)
3. **Resend Dashboard** - Visit https://resend.com to view sent emails

## Troubleshooting

**No email sent:**
- Check RESEND_API_KEY is set correctly in `.env`
- Verify email address is valid
- Check server console for error messages

**Email in spam:**
- This is normal for onboarding@resend.dev
- Use your verified domain for production

