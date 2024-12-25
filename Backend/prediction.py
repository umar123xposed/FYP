import torch
from torchvision import transforms, models
from PIL import Image
import torch.nn as nn
import sys

def predict(image_path, model_path="saved/models/BCDensenet/0708_020449/model_best.pth"):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Define DenseNet model
    model = models.densenet121(pretrained=False)  # Do not use pretrained weights
    model.classifier = nn.Linear(1024, 2)

    # Load checkpoint
    checkpoint = torch.load(model_path, map_location=device)

    if 'state_dict' in checkpoint:  # If checkpoint contains 'state_dict'
        model.load_state_dict(checkpoint['state_dict'])
    else:  # If checkpoint is the state_dict itself
        model.load_state_dict(checkpoint)

    model.to(device)
    model.eval()

    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    image = Image.open(image_path).convert("RGB")
    input_tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_tensor)
        prediction = torch.argmax(output, dim=1).item()

    class_names = ["Benign(Non-Cancerous)", "Malignant(Cancerous)"]
    return class_names[prediction]


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python prediction.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    result = predict(image_path)
    print(f"Prediction: {result}")
