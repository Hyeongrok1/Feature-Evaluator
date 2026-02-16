export async function get_data() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Hyeongrok1/Feature-Evaluator/refs/heads/main/public/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonObject = await response.json();
        console.log(jsonObject);
        return jsonObject;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


export async function get_scores() {
    const data = await get_data();

    const transformFeatures = (data) => {
        if (!data || !data.features) return [];

        return data.features.map(feature => {
            const modelOrder = ["gpt", "gemini", "llama"];

            const sortedExps = (feature.explanations || []).sort((a, b) => {
                const nameA = (a.llm_explainer || "").toLowerCase();
                const nameB = (b.llm_explainer || "").toLowerCase();
                
                const indexA = modelOrder.findIndex(m => nameA.includes(m));
                const indexB = modelOrder.findIndex(m => nameB.includes(m));
                
                return indexA - indexB;
            });

            const getScoreSafe = (index) => (sortedExps[index] && sortedExps[index].scores) ? sortedExps[index].scores : {};

            const firstScore = getScoreSafe(0);
            const secondScore = getScoreSafe(1);
            const thirdScore = getScoreSafe(2);

            return {
                feature_id: feature.feature_id,
                first_fuzz: firstScore.fuzz ?? 0,
                first_detection: firstScore.detection ?? 0,
                first_embedding: firstScore.embedding ?? 0,
                second_fuzz: secondScore.fuzz ?? 0,
                second_detection: secondScore.detection ?? 0,
                second_embedding: secondScore.embedding ?? 0,
                third_fuzz: thirdScore.fuzz ?? 0,
                third_detection: thirdScore.detection ?? 0,
                third_embedding: thirdScore.embedding ?? 0
            };
        });
    };

    return transformFeatures(data);
}