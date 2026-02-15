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
        if (!data.features) return [];

        return data.features.map(feature => {
            const exps = feature.explanations;

            const baseResult = {
                feature_id: feature.feature_id,
                first_fuzz: -1, first_detection: -1, first_embedding: -1,
                second_fuzz: -1, second_detection: -1, second_embedding: -1,
                third_fuzz: -1, third_detection: -1, third_embedding: -1
            };

            if (!exps || exps.length === 0) return baseResult;

            const getScoreSafe = (index) => (exps[index] && exps[index].scores) ? exps[index].scores : {};

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