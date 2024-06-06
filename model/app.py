from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load the model
with open('isolation_forest_model.pkl', 'rb') as file:
    model = pickle.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    transcripts = data['clean_transcripts']
    
    # Assuming your model expects a list of transcripts and returns a list of predictions
    predictions = model.predict(transcripts)
    
    return jsonify(predictions.tolist())

if __name__ == '__main__':
    app.run(debug=True)
