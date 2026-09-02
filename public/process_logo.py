import sys
try:
    from PIL import Image, ImageEnhance
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'Pillow'])
    from PIL import Image, ImageEnhance

img = Image.open('logo.png').convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    # item is (R, G, B, A)
    # Check if pixel is white or very close to white
    if item[0] > 230 and item[1] > 230 and item[2] > 230:
        newData.append((255, 255, 255, 0)) # transparent
    else:
        newData.append(item)

img.putdata(newData)

# Enhance color (Saturation and Brightness)
enhancer = ImageEnhance.Color(img)
img = enhancer.enhance(1.5) # Increase saturation

enhancer = ImageEnhance.Contrast(img)
img = enhancer.enhance(1.2)

img.save('logo.png')
print("Logo processed successfully!")
