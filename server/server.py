# server.py

from flask import Flask, request, jsonify
from transformers import BertTokenizer, BertModel
import torch
import re
import pickle
from sklearn.ensemble import IsolationForest

app = Flask(__name__)

# Load BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

# Load Isolation Forest model
with open('../model/isolation_forest_model.pkl', 'rb') as f:
    isolation_forest = pickle.load(f)

def clean_text(text):
    text = text.lower()
    text = text.replace('\n', ' ')
    text = re.sub(r"n't", ' not', text)
    text = re.sub(r"'re", ' are', text)
    text = re.sub(r"'s", ' is', text)
    text = re.sub(r"'d", ' would', text)
    text = re.sub(r"'ll", ' will', text)
    text = re.sub(r"'t", ' not', text)
    text = re.sub(r"'ve", ' have', text)
    text = re.sub(r"'m", ' am', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()

    return text

@app.route('/predict_anomaly', methods=['POST'])
def predict_anomaly():
    data = request.json
    text = data['text']
    cleaned_text = clean_text(text)
    tokenized_text = tokenizer(cleaned_text, padding='max_length', truncation=True, return_tensors='pt')
    with torch.no_grad():
        outputs = model(**tokenized_text)
        embeddings = outputs.last_hidden_state.mean(dim=1)
    anomaly_prediction = isolation_forest.predict(embeddings.numpy())
    return jsonify({'prediction': int(anomaly_prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
