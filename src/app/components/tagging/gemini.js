import { GoogleGenerativeAI } from "@google/generative-ai";

export const getFeatureSummary = async (jsonData, X, Y, Z, filteredSets, apikey) => {
    const genAI = new GoogleGenerativeAI(apikey);
    const { gpt, gemini, llama } = filteredSets;

    const gptTargetIds = new Set(gpt.map(f => f.feature_id));
    const geminiTargetIds = new Set(gemini.map(f => f.feature_id));
    const llamaTargetIds = new Set(llama.map(f => f.feature_id));

    const samples = { gpt: [], gemini: [], llama: [] };

    if (!jsonData || !jsonData.features) return "Data unloaded";

    jsonData.features.forEach(feature => {
        const fId = feature.feature_id;
        
        const isGptTarget = gptTargetIds.has(fId);
        const isGeminiTarget = geminiTargetIds.has(fId);
        const isLlamaTarget = llamaTargetIds.has(fId);

        if (!isGptTarget && !isGeminiTarget && !isLlamaTarget) return;

        (feature.explanations || []).forEach(exp => {
            const explainer = exp.llm_explainer;

            const normalizedExplainer = explainer.trim();

            if (normalizedExplainer === "openai/gpt-4o-mini" && isGptTarget) {
                samples.gpt.push({
                    id: fId,
                    text: exp.text,
                    fuzz: exp.scores.fuzz,
                    detect: exp.scores.detection
                });
            } 
            else if (normalizedExplainer === "google/gemini-flash-2.5" && isGeminiTarget) {
                samples.gemini.push({
                    id: fId,
                    text: exp.text,
                    fuzz: exp.scores.fuzz,
                    detect: exp.scores.detection
                });
            } 
            else if (normalizedExplainer === "hugging-quants/Meta-Llama-3.1-70B-Instruct-AWQ-INT4" && isLlamaTarget) {
                samples.llama.push({
                    id: fId,
                    text: exp.text,
                    fuzz: exp.scores.fuzz,
                    detect: exp.scores.detection
                });
            }
        });
    });

    const uniqueSamples = {
        gpt: Array.from(new Map(samples.gpt.map(item => [item.id, item])).values()),
        gemini: Array.from(new Map(samples.gemini.map(item => [item.id, item])).values()),
        llama: Array.from(new Map(samples.llama.map(item => [item.id, item])).values())
    };
    

    const prompt = `
        당신은 Sparse Autoencoder(SAE) 해석 및 평가 전문가입니다.
        제공된 메트릭 범위를 기준으로 필터링된 모델별 데이터의 특성을 대조 분석하여 보고서를 작성하세요.
        
        ### [참조 지식: 메트릭 정의]
        1. DETECTION: 전체 문맥의 활성화 여부를 식별. 문맥 파악 능력 중심.
        2. FUZZING: 개별 토큰의 활성화 여부를 식별. 시뮬레이션과 상관관계 높음.
        3. EMBEDDING: 해석(쿼리)과 문맥(문서) 간의 의미론적 유사도 기반 AUROC 점수.
        * Fuzzing은 높고 Detection이 낮으면 특정 단어에는 반응하나 문맥 이해는 부족한 해석임.

        ### [중요 지시 사항]
        - 출력문에 볼드체 강조 기호(예: **텍스트**)를 절대 사용하지 마세요. 
        - 모든 텍스트는 일반 텍스트로만 작성하세요.
        - 불필요한 줄바꿈을 최소화하고 가독성 있게 작성하세요.
        - 가상의 수치를 지어내지 말고 제공된 통계 수치만 인용하세요.

        ### [1. 필터링 기준 및 통계]
        - 설정 범위: Embedding(${X.range[0].toFixed(3)}~${X.range[1].toFixed(3)}), Fuzz(${Y.range[0].toFixed(3)}~${Y.range[1].toFixed(3)}), Detection(${Z.range[0].toFixed(3)}~${Z.range[1].toFixed(3)})
        - 범위 내 모델별 유효 데이터 수: 
          GPT-4o-mini: ${uniqueSamples.gpt.length}개
          Gemini-flash: ${uniqueSamples.gemini.length}개
          Llama-3.1-70B: ${uniqueSamples.llama.length}개

        ### [2. 모델별 격리 분석 데이터 (샘플)]
        *주의: 아래 데이터는 분석을 돕기 위한 일부 샘플이며, 전체 경향은 위 통계 수치를 바탕으로 판단하세요.*
        - GPT 분석 데이터: ${JSON.stringify(uniqueSamples.gpt.slice(0, 3), null, 2)}
        - Gemini 분석 데이터: ${JSON.stringify(uniqueSamples.gemini.slice(0, 3), null, 2)}
        - Llama 분석 데이터: ${JSON.stringify(uniqueSamples.llama.slice(0, 3), null, 2)}

        ### [3. 분석 요청 사항]
        1. 모델별 해석 전략 대조: 동일한 Feature ID가 존재할 경우 각 모델이 포착한 개념의 구체성과 어휘 선택의 차이를 비교하세요.
        2. 수량 및 분포 성향: 위 통계 숫자를 바탕으로 특정 모델이 이 점수 구간에서 더 높은 빈도로 발견되는 이유를 기술하세요.
        3. 점수와 해석의 상관관계: 각 모델의 fuzz 및 detect 점수가 실제 설명(text)의 선명도와 어떻게 연결되는지 분석하세요.
        4. 기술적 통찰: 현재 설정된 메트릭 구간이 고품질 SAE 피처를 선별하는 지표로서 어떤 유의미한 가치를 지니는지 요약하세요.

        ### [출력 형식]
        - 모델별 해석 성향 대조 분석
        - 설명의 질적 특이점 및 통계적 유의미성
        - 해당 점수 범위의 기술적 시사점
        - 인사이트 요약
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(prompt);
        return result.response.text().replace(/\*\*/g, "");
    } catch (error) {
        return `Error: ${error.message}`;
    }
};