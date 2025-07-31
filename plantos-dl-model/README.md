🌿 Plantos DL Model
A deep learning microservice for plant disease detection, built with PyTorch and served using FastAPI. This service classifies plant leaf images into 15 disease categories using a transfer-learned MobileNetV2 model.

🚀 Features
15-class plant disease classifier

Transfer learning on MobileNetV2

FastAPI-based REST API

Docker-ready for cloud deployment

Easy to extend or retrain

🗂️ Project Structure
plaintext
Copy
Edit
.
├── app.py                # FastAPI API server
├── weights.pth           # trained PyTorch weights
├── class_to_idx.json     # class-to-index mapping
├── requirements.txt      # Python dependencies
└── README.md
🏷️ Supported Classes
Your model recognizes these 15 classes:

Pepper__bell___Bacterial_spot

Pepper__bell___healthy

Potato___Early_blight

Potato___Late_blight

Potato___healthy

Tomato_Bacterial_spot

Tomato_Early_blight

Tomato_Late_blight

Tomato_Leaf_Mold

Tomato_Septoria_leaf_spot

Tomato_Spider_mites_Two_spotted_spider_mite

Tomato__Target_Spot

Tomato__Tomato_YellowLeaf__Curl_Virus

Tomato__Tomato_mosaic_virus

Tomato_healthy

⚙️ Setup Instructions
1️⃣ Install dependencies
bash
Copy
Edit
pip install -r requirements.txt
2️⃣ Run locally
bash
Copy
Edit
python app.py
Or with Uvicorn directly:

bash
Copy
Edit
uvicorn app:app --reload
API docs will be available at:
http://127.0.0.1:8000/docs


📡 API Usage
Endpoint
POST /predict

Form-data
key	type	description
file	image	the plant leaf photo to test

Example with curl
bash
Copy
Edit
curl -X POST "http://127.0.0.1:8000/predict" \
  -F "file=@my_plant_image.jpg"
Response:

json
Copy
Edit
{
  "prediction": "Tomato_Late_blight"
}
🚀 Cloud Deployment
This project is production-ready for:

Docker on AWS EC2 / DigitalOcean

Render / Railway

Other cloud VPS providers

I can guide you with step-by-step deployment if you wish — just ask!

👨‍💻 Author
Yash Sinha
Plantos Project