<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Interaction rule

When the user sends a high-level sprint summary or context message, do not start implementation immediately.
Only begin coding when the user explicitly says one of:
- "implement now"
- "start coding"
- "apply this change"
- "execute this prompt"

Until then, respond with:
- understanding summary
- assumptions
- files likely to change
- waiting-for-approval confirmation
<!-- END:nextjs-agent-rules -->
