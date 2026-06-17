import os
from pyrogram import Client, filters
from pyrogram.handlers import MessageHandler

# 1. SETUP YOUR ACCOUNT CREDENTIALS
# Get these from https://my.telegram.org
API_ID = int(os.environ.get("API_ID", 31499571))  # Replace with your API ID
API_HASH = os.environ.get("API_HASH", "b993ce0fbc34e254ddbfa5da47296c5f")

# Initialize the Userbot Client (logs into your personal account)
app = Client("my_personal_account", api_id=API_ID, api_hash=API_HASH)

# Global runtime state to track if you are offline
IS_OFFLINE = False

# -------------------------------------------------------------------
# 1. STATUS TOGGLE COMMANDS
# -------------------------------------------------------------------

@app.on_message(filters.me & filters.command("off", prefixes="/"))
async def turn_off(client, message):
    global IS_OFFLINE
    IS_OFFLINE = True
    await message.edit_text("📴 *Status updated:* You are now OFFLINE. Auto-reply to friends is enabled.")

@app.on_message(filters.me & filters.command("on", prefixes="/"))
async def turn_on(client, message):
    global IS_OFFLINE
    IS_OFFLINE = False
    await message.edit_text("🔛 *Status updated:* You are now ONLINE. Auto-reply disabled.")

# -------------------------------------------------------------------
# 2. AUTO-REPLY LOGIC FOR YOUR FRIENDS
# -------------------------------------------------------------------

@app.on_message(filters.private & ~filters.me & ~filters.bot)
async def auto_reply_to_friends(client, message):
    global IS_OFFLINE
    
    # Only reply if you explicitly typed /off
    if not IS_OFFLINE:
        return

    # Don't reply if they sent a command
    if message.text and message.text.startswith("/"):
        return

    # Send the auto-reply to your friend in your chat
    await message.reply(
        "🤖 *SARAH Auto-Reply:*\n\n"
        "I am currently offline or away from my phone. I'll get back to you as soon as I'm back!",
        parse_mode=enums.ParseMode.MARKDOWN
    )

if __name__ == "__main__":
    from pyrogram import enums
    print("⚡ Starting SARAH Personal Userbot...")
    app.run()