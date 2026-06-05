import os
from telethon import TelegramClient, events

# Replace these or set them as environment variables
API_ID = int(os.environ.get('TELEGRAM_API_ID', 0))  # Replace 0 with your actual API ID (e.g., 1234567)
API_HASH = os.environ.get('TELEGRAM_API_HASH', 'your_api_hash_here')  # Replace with your actual API Hash

# Create the client session
# This will generate a 'sarah_userbot_session.session' file in the same directory on the first login.
client = TelegramClient('sarah_userbot_session', API_ID, API_HASH)

@client.on(events.NewMessage(incoming=True))
async def auto_reply(event):
    # Only reply to private messages (DMs), ignore groups and channels
    if event.is_private:
        sender = await event.get_sender()
        
        # Don't reply to bots or yourself
        if sender and not sender.bot and not sender.is_self:
            # Send the auto-reply message
            await event.reply(
                "🤖 *SARAH Auto-Reply:*\n\n"
                "I am currently offline or away. I'll get back to you as soon as I'm back!"
            )

if __name__ == '__main__':
    print("Starting SARAH Userbot...")
    # client.start() will ask for your phone number and login code in the terminal on first run
    client.start()
    print("SARAH Userbot is running successfully!")
    client.run_until_disconnected()
