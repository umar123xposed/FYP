import torch
from torchvision import transforms, models
from PIL import Image
import torch.nn as nn
import numpy as np
import cv2
import sys
import os


def predict(image_path, model_path="saved/models/BCDensenet/0118_042520/model_best.pth"):
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

    # Grad-CAM functionality
    def grad_cam_heatmap(model, input_tensor):
        gradients = []
        activations = []

        def backward_hook(module, grad_input, grad_output):
            gradients.append(grad_output[0])

        def forward_hook(module, input, output):
            activations.append(output)

        # Attach hooks to the last convolutional layer
        last_conv_layer = model.features[-1]
        last_conv_layer.register_forward_hook(forward_hook)
        last_conv_layer.register_backward_hook(backward_hook)

        # Forward pass
        output = model(input_tensor)
        prediction = torch.argmax(output, dim=1).item()

        # Backward pass
        model.zero_grad()
        class_loss = output[0, prediction]
        class_loss.backward()

        # Compute Grad-CAM heatmap
        grads = gradients[0].cpu().detach().numpy()
        acts = activations[0].cpu().detach().numpy()

        weights = np.mean(grads, axis=(2, 3))
        cam = np.sum(weights[:, :, None, None] * acts, axis=1).squeeze()

        cam = np.maximum(cam, 0)  # ReLU
        cam = cam / np.max(cam)  # Normalize

        return cam, prediction

    heatmap, predicted_class = grad_cam_heatmap(model, input_tensor)
    class_names = ["Benign(Non-Cancerous)", "Malignant(Cancerous)"]

    # Overlay heatmap on original image
    def overlay_heatmap(image_path, heatmap):
        original_image = cv2.imread(image_path)
        original_image = cv2.resize(original_image, (224, 224))

        heatmap = cv2.resize(heatmap, (original_image.shape[1], original_image.shape[0]))
        heatmap = np.uint8(255 * heatmap)
        heatmap_colored = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

        overlayed_image = cv2.addWeighted(original_image, 0.6, heatmap_colored, 0.4, 0)
        return overlayed_image

    overlayed_image = overlay_heatmap(image_path, heatmap)

    # Save the overlayed image
    output_path = "output_with_heatmap.png"
    cv2.imwrite(output_path, overlayed_image)

    return class_names[predicted_class], output_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python prediction.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    if not os.path.exists(image_path):
        print("Error: Image file not found.")
        sys.exit(1)

    result, heatmap_path = predict(image_path)
    print(f"Prediction: {result}")
    print(f"Heatmap saved at: {heatmap_path}")