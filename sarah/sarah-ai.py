import os
import telebot
import requests
import io
from flask import Flask, request
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, ChatPermissions

# Load the Telegram Token from Vercel Environment Variables
TOKEN = os.environ.get('TELEGRAM_TOKEN')
OWNER_ID = os.environ.get('7823382572')

STATUS_FILE = "/tmp/owner_status.txt"

def get_owner_status():
    if os.path.exists(STATUS_FILE):
        try:
            with open(STATUS_FILE, "r") as f:
                return f.read().strip() == "off"
        except Exception:
            pass
    return False

def set_owner_status(is_off):
    try:
        with open(STATUS_FILE, "w") as f:
            f.write("off" if is_off else "on")
    except Exception as e:
        print(f"Failed to write status file: {e}")

def is_owner(user_id):
    if not OWNER_ID:
        return False
    return str(user_id) == str(OWNER_ID)

# Initialize Bot and Flask App
# IMPORTANT: threaded=False is REQUIRED for Vercel! 
# Otherwise, Vercel kills the process before the bot can reply.
bot = telebot.TeleBot(TOKEN, threaded=False)
app = Flask(__name__)


# -------------------------------------------------------------------
# 1. AUTO-REPLY MESSAGES (Triggers instantly when someone messages)
# -------------------------------------------------------------------

# Fix: Using custom lambda function to ignore @botusername in group chats
@bot.message_handler(func=lambda message: message.text and message.text.split()[0].split('@')[0] in ['/start', '/help'])
def send_welcome(message):
    bot.reply_to(message, "Hello! 🚀 I am an always-active bot hosted on Vercel.")

# Handler to toggle owner status (Only owner can use this)
@bot.message_handler(func=lambda message: message.text and message.text.split()[0].split('@')[0] in ['/off', '/on'])
def toggle_status(message):
    if not is_owner(message.from_user.id):
        return
    
    command = message.text.split()[0].split('@')[0]
    if command == '/off':
        set_owner_status(True)
        bot.reply_to(message, "📴 Status updated: You are now OFFLINE. Auto-reply is enabled.")
    else:
        set_owner_status(False)
        bot.reply_to(message, "🔛 Status updated: You are now ONLINE. Auto-reply is disabled.")

# Auto-reply to private messages when owner is offline
@bot.message_handler(
    content_types=['text', 'photo', 'video', 'document', 'audio', 'voice', 'sticker'],
    func=lambda message: message.chat.type == 'private' and get_owner_status()
)
def auto_reply_offline(message):
    if is_owner(message.from_user.id):
        return
    # Avoid responding to slash commands
    if message.text and message.text.startswith('/'):
        return
    
    bot.reply_to(
        message,
        "🤖 *SARAH Auto-Reply:*\n\n"
        "I am currently offline or away. I'll get back to you as soon as I'm back!",
        parse_mode="Markdown"
    )


# Handler for XoerisHijack simulation command
@bot.message_handler(func=lambda message: message.text and (
    message.text.strip() == './telegram sudo ./python XoerisHijack.py' or
    message.text.strip() == './telegram sudo \\./python XoerisHijack.py'
))
@bot.channel_post_handler(func=lambda message: message.text and (
    message.text.strip() == './telegram sudo ./python XoerisHijack.py' or
    message.text.strip() == './telegram sudo \\./python XoerisHijack.py'
))
def handle_xoeris_hijack(message):
    lines = [
        "$ ./telegram sudo ./python XoerisHijack.py",
        "[Xoeris Framework v9.6.1]",
        "Initializing Remote Session...",
        "Bypassing Security Layer........ OK",
        "Injecting Payload............... OK",
        "Scanning Target Device.......... OK",
        "Target Found:",
        "Name      : [REDACTED]",
        "Status    : Online",
        "Location  : Tracked",
        "Photos    : Synced",
        "Contacts  : Exported",
        "WiFi Keys : Retrieved",
        "WARNING:",
        "Target has opened this message.",
        "Beginning automatic data extraction...",
        "Progress:",
        "[████████████████████] 100%",
        "Operation Complete.",
        "Result:",
        "Congratulations.",
        "You have successfully been identified as the most kepo person in this chat.",
        "No data was stolen.",
        "But your curiosity level has been permanently logged."
    ]
    for line in lines:
        try:
            bot.send_message(message.chat.id, line)
        except Exception as e:
            print(f"Failed to send line: {e}")


# Fix: Using custom lambda function to ignore @botusername in group chats
@bot.message_handler(func=lambda message: message.text and message.text.split()[0].split('@')[0] == '/notes')
def send_notes(message):
    # Custom notes for Acelbyte Discussion
    notes_content = (
        "📝 *List of files in Acelbyte Discussion:*\n\n"
        "Click a button below to download the file directly!"
    )
    
    # Create Inline Keyboard Buttons to avoid the @username text issue
    markup = InlineKeyboardMarkup()
    markup.row_width = 2
    markup.add(
        InlineKeyboardButton("corepatch", callback_data="corepatch"),
        InlineKeyboardButton("disable_rotate_button", callback_data="disable_rotate_button"),
        InlineKeyboardButton("dna_android", callback_data="dna_android"),
        InlineKeyboardButton("hyperceiler", callback_data="hyperceiler"),
        InlineKeyboardButton("lsposed", callback_data="lsposed"),
        InlineKeyboardButton("mt_manager", callback_data="mt_manager"),
        InlineKeyboardButton("platformtools", callback_data="platform-tools")
    )
    
    # You can use any direct image URL here (ending in .png, .jpg, etc.)
    image_url = "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop"
    
    try:
        # We use send_photo and pass the text into the 'caption' parameter
        bot.send_photo(
            chat_id=message.chat.id,
            photo=image_url,
            caption=notes_content,
            parse_mode="Markdown",
            reply_to_message_id=message.message_id,
            reply_markup=markup
        )
    except Exception as e:
        # Fallback: if the image URL is broken, it will just send the text normally
        print(f"Failed to send image: {e}")
        bot.reply_to(message, notes_content, parse_mode="Markdown", reply_markup=markup)

# -------------------------------------------------------------------
# 1.5 FILE HANDLERS (When user clicks a note command)
# -------------------------------------------------------------------

# Dictionary mapping commands to LOCAL file paths inside your repository.
# You MUST create a folder named "files" in your GitHub repo and upload the files there.
FILES_MAP = {
    'corepatch': 'sarah/files/app-release.apk',
    'dna-android': 'sarah/files/DNA-MOD_9.0.0-25__OrcaOnSteroids.apk',
    'hyperceiler': 'sarah/files/HyperCeiler_2.6.161_20250829_4237_release.apk',
    'lsposed': 'files/lsposed.zip',
    'mt-manager': 'files/mt-manager.apk',
    'platform-tools': 'sarah/files/platform-tools.zip'
}

# Fix: Custom lambda function ensures the bot catches the command even if Telegram adds @sarahbyxoerisbot
@bot.message_handler(func=lambda message: message.text and message.text.startswith('/') and message.text.split()[0].split('@')[0][1:] in FILES_MAP)
def send_requested_file(message):
    # Extract the exact command by splitting off the @username part
    # Example: "/core_patch@sarahbyxoerisbot" -> "core_patch"
    command = message.text.split()[0].split('@')[0][1:]
    
    if command in FILES_MAP:
        file_path = FILES_MAP[command]
        status_msg = bot.reply_to(message, f"⏳ Uploading {command} from local storage...")
        
        try:
            # Build the absolute path to the file
            # Since this script is in the "api" folder, we go up one level to the root directory
            current_dir = os.path.dirname(os.path.abspath(__file__))
            root_dir = os.path.dirname(current_dir)
            absolute_path = os.path.join(root_dir, file_path)
            
            # Open the local file from your GitHub repository and send it
            with open(absolute_path, 'rb') as document_file:
                bot.send_document(
                    chat_id=message.chat.id, 
                    document=document_file,
                    reply_to_message_id=message.message_id
                )
            
            # Clean up by deleting the "Uploading..." loading message
            bot.delete_message(message.chat.id, status_msg.message_id)
            
        except FileNotFoundError:
            bot.edit_message_text(f"❌ File not found! Make sure you uploaded '{file_path}' to your GitHub repository.", 
                                  chat_id=message.chat.id, 
                                  message_id=status_msg.message_id)
        except Exception as e:
            bot.edit_message_text(f"❌ Failed to send file. Error: {e}", 
                                  chat_id=message.chat.id, 
                                  message_id=status_msg.message_id)

# --- NEW CALLBACK HANDLER FOR INLINE BUTTONS ---
@bot.callback_query_handler(func=lambda call: call.data in FILES_MAP)
def handle_file_callback(call):
    command = call.data
    file_path = FILES_MAP[command]
    
    # Give a quick 'loading' toast at the top of the user's screen
    bot.answer_callback_query(call.id, f"Fetching {command}...")
    
    status_msg = bot.send_message(call.message.chat.id, f"⏳ Uploading {command} from local storage...")
    
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        root_dir = os.path.dirname(current_dir)
        absolute_path = os.path.join(root_dir, file_path)
        
        with open(absolute_path, 'rb') as document_file:
            bot.send_document(
                chat_id=call.message.chat.id, 
                document=document_file
            )
        bot.delete_message(call.message.chat.id, status_msg.message_id)
        
    except FileNotFoundError:
        bot.edit_message_text(f"❌ File not found! '{file_path}' is missing.", 
                              chat_id=call.message.chat.id, 
                              message_id=status_msg.message_id)
    except Exception as e:
        bot.edit_message_text(f"❌ Failed to send file. Error: {e}", 
                              chat_id=call.message.chat.id, 
                              message_id=status_msg.message_id)

# -------------------------------------------------------------------
# 1.7 NEW USER CAPTCHA VERIFICATION
# -------------------------------------------------------------------

@bot.message_handler(content_types=['new_chat_members'])
def handle_new_members(message):
    for new_user in message.new_chat_members:
        # Ignore if the bot itself was added to the group
        bot_info = bot.get_me()
        if new_user.id == bot_info.id:
            continue
            
        try:
            # 1. Mute the user until they verify using the modern ChatPermissions class
            bot.restrict_chat_member(
                message.chat.id,
                new_user.id,
                permissions=ChatPermissions(
                    can_send_messages=False,
                    can_send_audios=False,
                    can_send_documents=False,
                    can_send_photos=False,
                    can_send_videos=False,
                    can_send_video_notes=False,
                    can_send_voice_notes=False,
                    can_send_polls=False,
                    can_send_other_messages=False,
                    can_add_web_page_previews=False
                )
            )
            
            # 2. Create the inline CAPTCHA button targeted at their specific User ID
            markup = InlineKeyboardMarkup()
            callback_data = f"captcha_{new_user.id}"
            markup.add(InlineKeyboardButton("I am human 🤖❌", callback_data=callback_data))
            
            # 3. Send the challenge to the chat
            welcome_text = (
                f"Welcome to the group, [{new_user.first_name}](tg://user?id={new_user.id})! 👋\n\n"
                f"To protect this group from bots, you have been muted. "
                f"Please click the button below to verify you are human and unlock chat privileges."
            )
            bot.send_message(
                message.chat.id,
                welcome_text,
                parse_mode="Markdown",
                reply_markup=markup
            )
            
        except Exception as e:
            print(f"Failed to mute user or send CAPTCHA. Make sure the bot is an Admin. Error: {e}")

# Handler for the CAPTCHA button click
@bot.callback_query_handler(func=lambda call: call.data.startswith('captcha_'))
def verify_captcha(call):
    # Get the ID of the user who is SUPPOSED to click this button
    target_user_id = int(call.data.split('_')[1])
    
    # Check if the person clicking the button is the targeted user
    if call.from_user.id == target_user_id:
        try:
            # 1. Unmute the user by restoring their permissions
            bot.restrict_chat_member(
                call.message.chat.id,
                target_user_id,
                permissions=ChatPermissions(
                    can_send_messages=True,
                    can_send_audios=True,
                    can_send_documents=True,
                    can_send_photos=True,
                    can_send_videos=True,
                    can_send_video_notes=True,
                    can_send_voice_notes=True,
                    can_send_polls=True,
                    can_send_other_messages=True,
                    can_add_web_page_previews=True,
                    can_invite_users=True
                )
            )
            
            # 2. Alert the user that verification succeeded
            bot.answer_callback_query(call.id, "Verification successful! You can now chat.")
            
            # 3. Update the CAPTCHA message to show they passed
            bot.edit_message_text(
                f"✅ [{call.from_user.first_name}](tg://user?id={call.from_user.id}) has been successfully verified!",
                chat_id=call.message.chat.id,
                message_id=call.message.message_id,
                parse_mode="Markdown"
            )
            
        except Exception as e:
            bot.answer_callback_query(call.id, "Failed to restore permissions. Check Bot Admin rights.")
            print(f"Error unmuting user: {e}")
            
    else:
        # If someone else tries to click it, warn them
        bot.answer_callback_query(call.id, "❌ This verification button is not for you!", show_alert=True)

# -------------------------------------------------------------------
# 2. CORE WEBHOOK ROUTE (Telegram sends messages here)
# -------------------------------------------------------------------

@app.route('/webhook', methods=['POST'])
def webhook():
    """This endpoint receives updates from Telegram."""
    if request.headers.get('content-type') == 'application/json':
        json_string = request.get_data().decode('utf-8')
        update = telebot.types.Update.de_json(json_string)
        bot.process_new_updates([update])
        return '', 200
    else:
        return 'Invalid request', 403

# -------------------------------------------------------------------
# 3. SETUP ROUTE (Run this once to link Telegram to Vercel)
# -------------------------------------------------------------------

@app.route('/set_webhook', methods=['GET'])
def set_webhook():
    """Visit this URL once to tell Telegram where to send messages."""
    # Dynamically grab your Vercel URL
    webhook_url = f"{request.url_root}webhook" 
    
    bot.remove_webhook()
    success = bot.set_webhook(url=webhook_url)
    
    if success:
        return f"Success! Webhook set to: {webhook_url}", 200
    else:
        return "Failed to set webhook.", 500

# -------------------------------------------------------------------
# 4. AUTOMATIC SCHEDULED MESSAGES (Vercel Cron Job)
# -------------------------------------------------------------------

@app.route('/cron', methods=['GET'])
def cron_job():
    """Vercel will hit this endpoint automatically based on vercel.json schedule."""
    # The Chat ID where you want the scheduled message to go
    chat_id = os.environ.get('TARGET_CHAT_ID') 
    
    if not chat_id:
        return "TARGET_CHAT_ID not set in Vercel environment variables.", 400
    
    try:
        bot.send_message(chat_id, "⏰ Automatic scheduled message from Vercel!")
        return "Scheduled message sent!", 200
    except Exception as e:
        return f"Error sending message: {e}", 500

# -------------------------------------------------------------------
# 5. KEEP ALIVE ROUTE (Fixes the delay / cold start issue)
# -------------------------------------------------------------------

@app.route('/keep_alive', methods=['GET'])
def keep_alive():
    """Ping this route quietly to prevent Vercel from sleeping (fixes delay)."""
    return "Bot is warm and awake! 🔥", 200

# Basic health check route
@app.route('/bot_status')
def bot_status():
    return "Bot is running on Vercel! 🟢"

# Required for Vercel
if __name__ == '__main__':
    app.run(debug=True)