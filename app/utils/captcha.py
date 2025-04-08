import random
import string
import io
from PIL import Image, ImageDraw, ImageFont
import base64

def generate_captcha_text(length=6):
    """Generate a random string of letters and numbers for CAPTCHA."""
    # Using uppercase letters and digits for better readability
    characters = string.ascii_uppercase + string.digits
    # Exclude similar-looking characters
    characters = characters.replace('O', '').replace('0', '').replace('I', '').replace('1', '')
    return ''.join(random.choice(characters) for _ in range(length))

def generate_captcha_image(text, width=200, height=80):
    """Generate a CAPTCHA image containing the given text."""
    # Create a new image with white background
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)
    
    try:
        # Try to use a font (if available)
        font = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Draw text
    text_width, text_height = draw.textsize(text, font=font) if hasattr(draw, 'textsize') else (width//2, height//2)
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Add some rotation to each character for added security
    for i, char in enumerate(text):
        angle = random.randint(-30, 30)
        char_x = x + i * (text_width // len(text))
        char_y = y + random.randint(-10, 10)
        draw.text((char_x, char_y), char, font=font, fill=(0, 0, 100))
    
    # Add noise (dots and lines)
    for _ in range(width * height // 50):
        draw.point((random.randint(0, width), random.randint(0, height)), 
                   fill=(random.randint(0, 200), random.randint(0, 200), random.randint(0, 200)))
    
    for _ in range(5):
        start = (random.randint(0, width//4), random.randint(0, height))
        end = (random.randint(3*width//4, width), random.randint(0, height))
        draw.line([start, end], fill=(random.randint(0, 200), random.randint(0, 200), random.randint(0, 200)))
    
    # Convert image to base64 to display in HTML
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return f"data:image/png;base64,{img_str}"

def generate_captcha():
    """Generate a CAPTCHA with both text and image."""
    text = generate_captcha_text()
    image = generate_captcha_image(text)
    return {'text': text, 'image': image}