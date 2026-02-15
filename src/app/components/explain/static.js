export async function get_data() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Hyeongrok1/Feature-Evaluator/refs/heads/main/public/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonObject = await response.json();
        return jsonObject;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


export async function get_scatter_data(X, Y) {
    const data = await get_data();
    const features = data.features;
    const newFeatures = [];

    for (const feature of features) {
        let xAxis;
        let yAxis;
        let xVal;
        let yVal;
        if (feature.explanations === null || feature.explanations === undefined) continue; 
        
        for (const explanation of feature.explanations) {

            if (X.label === "Embedding") {
                xAxis = "Embedding";
                const val = explanation["scores"]["embedding"];
                if (X.range[0] < val && val < X.range[1]) {
                    console.log(X.range[0]);
                    xVal = val; 
                } else {
                    continue;
                }
            }
            if (Y.label === "Embedding") {
                yAxis = "Embedding";
                const val = explanation["scores"]["embedding"];
                if (Y.range[0] < val && val < Y.range[1]) {
                    yVal = val; 
                } else {
                    continue;
                }
            }

            if (X.label === "Fuzz") {
                xAxis = "Fuzz";
                const val = explanation["scores"]["fuzz"];
                if (X.range[0] < val && val < X.range[1]) {
                    xVal = val; 
                } else {
                    continue;
                }
            }
            if (Y.label === "Fuzz") {
                yAxis = "Fuzz";
                const val = explanation["scores"]["fuzz"];
                if (Y.range[0] < val && val < Y.range[1]) {
                    yVal = val; 
                } else {
                    continue;
                }
            }

            if (X.label === "Detection") {
                xAxis = "Detection";
                const val = explanation["scores"]["detection"];
                if (X.range[0] < val && val < X.range[1]) {
                    xVal = val; 
                } else {
                    continue;
                }
            }
            if (Y.label === "Detection") {
                yAxis = "Detection";
                const val = explanation["scores"]["fuzz"];
                if (Y.range[0] < val && val < Y.range[1]) {
                    yVal = val; 
                } else {
                    continue;
                }
            }
            newFeatures.push({
                feature_id: feature.feature_id,
                model: explanation["llm_explainer"],
                xy: {
                    x: xVal,
                    y: yVal
                }
            })
        }
    }
    console.log(newFeatures);
    return {
        sae_id: data.sae_id,
        features: newFeatures
    };
}

export async function get_explains(featureId) {
    const data = await get_data();
    let explanation = null;

    const foundFeature = data.features.find(feature => 
        feature.feature_id === featureId
    );
    
    if (foundFeature) explanation = foundFeature.explanations;
    
    if (explanation === null || explanation === undefined) {
        const defaultItem = {
            llm_explainer: "",
            detection: 0,
            embedding: 0,
            fuzz: 0,
            Text: ""
        };
        
        return new Array(3).fill(defaultItem); 
    }

    const transformedData = explanation.map(item => {
        const scores = item.scores || {}; 
        
        return {
            explainer: item.llm_explainer,
            detection: scores.detection || 0, 
            embedding: scores.embedding || 0,
            fuzz: scores.fuzz || 0,
            Text: item.text
        };
    });
    
    return transformedData;
}