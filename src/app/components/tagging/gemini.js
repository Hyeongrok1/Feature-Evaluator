import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * @param {Object} jsonData - 전체 데이터 (필요 시 참조)
 * @param {Object} filteredSets - { all: [], gpt: [], gemini: [], llama: [] }
 * @param {string} apikey - API 키
 */
export const getFeatureSummary = async (jsonData, filteredSets, apikey) => {
    const genAI = new GoogleGenerativeAI(apikey);
    const { all, gpt, gemini, llama } = filteredSets;

    // 1. 전달받은 필터링된 배열에서 모델별 explanation과 score를 매핑
    // ParallelChart의 데이터 구조(first_embedding 등)를 그대로 사용합니다.
    const samples = {
        gpt: gpt.slice(0, 3).map(d => ({
            feature_id: d.feature_id,
            explanation: d.first_explanation || "No explanation",
            scores: { embedding: d.first_embedding, fuzz: d.first_fuzz, detection: d.first_detection }
        })),
        gemini: gemini.slice(0, 3).map(d => ({
            feature_id: d.feature_id,
            explanation: d.second_explanation || "No explanation",
            scores: { embedding: d.second_embedding, fuzz: d.second_fuzz, detection: d.second_detection }
        })),
        llama: llama.slice(0, 3).map(d => ({
            feature_id: d.feature_id,
            explanation: d.third_explanation || "No explanation",
            scores: { embedding: d.third_embedding, fuzz: d.third_fuzz, detection: d.third_detection }
        }))
    };

    const prompt = `
        당신은 Sparse Autoencoder(SAE) 해석 전문가입니다.
        아래 통계는 화면 상단의 드롭다운 버튼 숫자(All, GPT, Gemini, Llama)와 물리적으로 동일한 데이터입니다.
        가상의 수치를 절대 언급하지 말고, 제공된 숫자만 사용하여 분석 보고서를 작성하세요.

        ### [제약 사항]
        - 출력문에 볼드체 강조 기호(**)를 절대 사용하지 마세요.
        - 모든 강조는 일반 텍스트로만 구성하세요.
        - 불필요한 줄바꿈을 최소화하여 가독성을 높이세요.

        ### [1. 확정 필터링 통계]
        - 전체(All) 필터링된 피처 수: ${all.length}개
        - 모델별 개별 통계:
          * GPT-4o-mini: ${gpt.length}개
          * Gemini-flash: ${gemini.length}개
          * Llama-3.1-70B: ${llama.length}개

        ### [2. 모델별 샘플 데이터]
        *동일한 Feature ID에 대해 모델들이 어떻게 다르게 해석했는지 대조 분석하세요.*
        - GPT 샘플: ${JSON.stringify(samples.gpt, null, 2)}
        - Gemini 샘플: ${JSON.stringify(samples.gemini, null, 2)}
        - Llama 샘플: ${JSON.stringify(samples.llama, null, 2)}

        ### [3. 분석 요청]
        1. 모델별 해석 분포: 위 확정 통계 숫자를 인용하여, 특정 모델이 이 구간에서 더 높은 빈도로 발견되는 이유를 분석하세요.
        2. 설명 전략 대조: 샘플 데이터를 통해 동일 피처에 대해 각 모델이 사용한 어휘의 정밀도와 개념적 깊이를 비교하세요.
        3. 기술적 인사이트: 현재 설정된 메트릭 범위가 고품질 SAE 피처를 선별하는 지표로서 어떤 유의미한 가치를 지니는지 3문장 이내로 요약하세요.

        ### [출력 형식]
        - 모델별 해석 성향 대조 분석
        - 설명의 질적 특이점 분석
        - 기술적 시사점 및 전문가 요약
    `;

    // 디버깅 로그
    console.group("📊 Gemini API Sync Debug");
    console.log("Counts - All:", all.length, "GPT:", gpt.length, "Gemini:", gemini.length, "Llama:", llama.length);
    console.log("Sample Data Sent:", samples);
    console.groupEnd();

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(prompt);
        // 결과에서 볼드체 기호 완전 제거
        return result.response.text().replace(/\*\*/g, "");
    } catch (error) {
        console.error("Gemini API Error:", error);
        return `Error: ${error.message}`;
    }
};