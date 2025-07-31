from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import json
import requests
from collections import Counter
from torchvision.models import MobileNet_V2_Weights

app = FastAPI()


with open("class_to_idx.json", "r") as f:
    original_class_map = json.load(f)

class_map = {str(v): k for k, v in original_class_map.items()}


transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])


num_classes = len(class_map)
weights = MobileNet_V2_Weights.DEFAULT
model = models.mobilenet_v2(weights=weights)
model.classifier[1] = nn.Linear(model.last_channel, num_classes)


model.load_state_dict(torch.load("weights.pth", map_location=torch.device("cpu")))
model.eval()


class PredictRequest(BaseModel):
    urls: list[str]

@app.post("/predict")
async def predict(req: PredictRequest):
    predictions = []
    
    for url in req.urls:
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                              "AppleWebKit/537.36 (KHTML, like Gecko) "
                              "Chrome/120.0.0.0 Safari/537.36"
            }
            response = requests.get(url, timeout=5, headers=headers)
            response.raise_for_status()
        except Exception as e:
            continue  
        
        try:
            image = Image.open(io.BytesIO(response.content)).convert("RGB")
        except Exception:
            continue
        
        input_tensor = transform(image).unsqueeze(0)
        with torch.no_grad():
            outputs = model(input_tensor)
            _, predicted = torch.max(outputs, 1)
            class_idx = predicted.item()
        
        class_name = class_map.get(str(class_idx), f"unknown_class_{class_idx}")
        tokens = class_name.split("_")
        
        # pepper bell rule
        if tokens[0].lower() == "pepper" and len(tokens) >= 3 and tokens[2].lower() == "bell":
            species = "pepper bell"
            disease = " ".join(tokens[3:]) if len(tokens) > 3 else "unknown"
        else:
            species = tokens[0]
            disease = " ".join(tokens[1:]) if len(tokens) > 1 else "unknown"
        
        species = species.replace("_", " ").strip()
        disease = disease.replace("_", " ").strip()
        
        predictions.append((species, disease))
    
    if not predictions:
        raise HTTPException(status_code=400, detail="No valid images processed")
    
    # get most frequent
    most_common = Counter(predictions).most_common(1)[0][0]
    
    return {"species": most_common[0], "disease": most_common[1]}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
