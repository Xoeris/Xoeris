import os
from telethon import TelegramClient, events

# Replace these or set them as environment variables
API_ID = int(os.environ.get('TELEGRAM_API_ID', 31499571))  # Replace with your actual API ID (e.g., 1234567)
API_HASH = os.environ.get('TELEGRAM_API_HASH', 'b993ce0fbc34e254ddbfa5da47296c5f')  # Replace with your actual API Hash

# Create the client session
client = TelegramClient('sarah_userbot_session', API_ID, API_HASH)

# Global status variable
is_offline = False

# 1. Listen to OUTGOING messages (sent by YOU) to toggle status
@client.on(events.NewMessage(outgoing=True))
async def handle_outgoing(event):
    global is_offline
    if event.text:
        text = event.text.strip().lower()
        if text == '.off':
            is_offline = True
            await event.edit("📴 *SARAH Userbot:* Away mode enabled.")
        elif text == '.on':
            is_offline = False
            await event.edit("🔛 *SARAH Userbot:* Away mode disabled.")

# 2. Listen to INCOMING messages to auto-reply when offline
@client.on(events.NewMessage(incoming=True))
async def handle_incoming(event):
    global is_offline
    # Only reply if you are offline and it's a private chat (DM)
    if is_offline and event.is_private:
        sender = await event.get_sender()
        
        # Don't reply to bots or yourself
        if sender and not sender.bot and not sender.is_self:
            await event.reply(
                "🤖 *SARAH Auto-Reply:*\n\n"
                "I am currently offline or away. I'll get back to you as soon as I'm back!"
            )

if __name__ == '__main__':
    print("Starting SARAH Userbot...")
    # On first run, this will ask for your phone number and login code in the terminal
    client.start()
    print("SARAH Userbot is running successfully!")
    client.run_until_disconnected()
