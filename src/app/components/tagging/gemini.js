import { GoogleGenerativeAI } from "@google/generative-ai";
export const getFeatureSummary = async (jsonData, stats, apikey) => {
    const genAI = new GoogleGenerativeAI(apikey);
    const { X, Y, Z } = stats;
    const inRangeData = [];
    const modelCounts = {};
    const outOfRangeSample = []; 

    if (!jsonData || !jsonData.features) {
        console.error("Invalid data structure");
        return "Data unloaded";
    }

    jsonData.features.forEach(feature => {
        (feature.explanations || []).forEach(exp => {
            const scores = exp.scores;
            if (!scores) return; 

            const isInside = 
                scores.embedding >= X.range[0] && scores.embedding <= X.range[1] &&
                scores.fuzz >= Y.range[0] && scores.fuzz <= Y.range[1] &&
                scores.detection >= Z.range[0] && scores.detection <= Z.range[1];

            const summaryInfo = {
                model: exp.llm_explainer || "Unknown Model",
                text: exp.text || "No explanation provided",
                scores: scores
            };

            if (isInside) {
                inRangeData.push(summaryInfo);
                const modelName = exp.llm_explainer || "Unknown";
                modelCounts[modelName] = (modelCounts[modelName] || 0) + 1;
            } else if (outOfRangeSample.length < 5) {
                outOfRangeSample.push(summaryInfo);
            }
        });
    });

    const prompt = `
        당신은 Sparse Autoencoder(SAE) 해석 및 평가 전문가입니다.
        제공된 메트릭 범위를 기준으로 필터링된 데이터의 특성을 대조 분석하여 보고서를 작성하세요.
        특히 어떤 모델이 더 적절한 설명을 만드는지 어떤 설명을 만드는지 비교해야 합니다.
        불필요한 줄바꿈이 많이 없도록 작성하세요.

        ### [1. 필터링 기준 및 통계]
        - 설정 범위: Embedding(${X.range[0]}~${X.range[1]}), Fuzz(${Y.range[0]}~${Y.range[1]}), Detection(${Z.range[0]}~${Z.range[1]})
        - 범위 내 모델별 설명 빈도: ${JSON.stringify(modelCounts)}
        - 총 필터링된 데이터 수: ${inRangeData.length}개

        ### [2. 비교 분석용 샘플 데이터]
        - **범위 내(Target) 샘플**: ${JSON.stringify(inRangeData.slice(0, 8), null, 2)}
        - **범위 밖(Reference) 샘플**: ${JSON.stringify(outOfRangeSample, null, 2)}

        ### [3. 분석 요청 사항]
        1. **수량 및 모델 분포**: 특정 모델이 이 범위에 집중되어 있다면 그 이유(모델의 추론 성향 등)를 통계 수치와 연결해 설명하세요.
        2. **질적 차이 분석**: 범위 내 데이터가 대조군(Reference)에 비해 얼마나 더 구체적인 개념을 포착하는지, '텍스트의 응집성'과 '정밀도' 관점에서 분석하세요.
        3. **기술적 통찰**: 이 메트릭 구간의 데이터들이 SAE의 피처 분리(Feature Disentanglement) 및 해석 가능성(Interpretability) 향상에 어떻게 기여하는지 전문 용어를 사용하여 3문장 이내로 요약하세요.

        ### [출력 형식]
        - [모델별 분포 분석]
        - [설명의 질적 특이점]
        - [해당 점수 범위가 시사하는 바]
        - [기술적 인사이트 요약]
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });        
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
        
    } catch (error) {
        console.error("Gemini API Error:", error);
        return `Error: ${error.message}. check your API key or Network status`;
    }
};