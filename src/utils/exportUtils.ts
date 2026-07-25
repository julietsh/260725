import { LessonPlanData } from '../types';

export function formatPlanAsText(plan: LessonPlanData): string {
  const { inputParams, deconstruction, alignmentAudit, lessonCards, rubric, complementaryQuestions } = plan;

  let text = `========================================================\n`;
  text += ` [수업 설계안] ${plan.title || inputParams.achievementStandardContent}\n`;
  text += `========================================================\n\n`;

  text += `■ 성취기준: ${inputParams.achievementStandardCode} ${inputParams.achievementStandardContent}\n`;
  text += `■ 대상/차시: ${inputParams.learnerPersona.targetGrade} / ${inputParams.lessonCount}차시\n`;
  text += `■ 평가 방식: ${inputParams.assessmentMethod}\n\n`;

  text += `--------------------------------------------------------\n`;
  text += `1. 성취기준 분해 (Deconstruction)\n`;
  text += `--------------------------------------------------------\n`;
  text += `- 이해(Knowledge): ${deconstruction.knowledgeUnderstanding}\n`;
  text += `- 적용(Skill): ${deconstruction.application}\n`;
  text += `- 설명(Attitude/Reflection): ${deconstruction.explanation}\n\n`;

  text += `--------------------------------------------------------\n`;
  text += `2. 목표-활동-평가 정합성 점검 (Alignment Score: ${alignmentAudit.alignmentScore}/100)\n`;
  text += `--------------------------------------------------------\n`;
  text += `[종합 평가] ${alignmentAudit.summaryNote}\n`;
  text += `[핵심 검증 포인트]\n`;
  alignmentAudit.checkPoints.forEach((cp, i) => {
    text += `  ${i + 1}. ${cp}\n`;
  });
  text += `[학습자 페르소나 반영 전략]\n`;
  alignmentAudit.personaCustomizations.forEach((pc, i) => {
    text += `  ${i + 1}. ${pc}\n`;
  });
  text += `\n`;

  text += `--------------------------------------------------------\n`;
  text += `3. 차시별 설계 카드 (Lesson Cards)\n`;
  text += `--------------------------------------------------------\n`;
  lessonCards.forEach((card) => {
    text += `[${card.lessonNumber}차시] ${card.topic}\n`;
    text += `· 차시 목표: ${card.objective}\n`;
    text += `· 주요 활동:\n`;
    text += `   - 도입: ${card.activities.introduction}\n`;
    text += `   - 전개: ${card.activities.development}\n`;
    text += `   - 정리: ${card.activities.summary}\n`;
    text += `· 평가 계획: [${card.assessment.method}] ${card.assessment.criteria}\n`;
    text += `· 페르소나 맞춤 지원:\n`;
    text += `   - 상위 20%(탐색 주도): ${card.personaSupport.highMaturity}\n`;
    text += `   - 하위 30%(무관심/불안): ${card.personaSupport.lowMaturity}\n\n`;
  });

  text += `--------------------------------------------------------\n`;
  text += `4. 수행 루브릭 초안 (${rubric.title})\n`;
  text += `--------------------------------------------------------\n`;
  rubric.criteria.forEach((crit, i) => {
    text += `<평가요소 ${i + 1}> ${crit.element}\n`;
    text += `  - 상(우수): ${crit.high}\n`;
    text += `  - 중(보통): ${crit.medium}\n`;
    text += `  - 하(기초): ${crit.low}\n\n`;
  });

  text += `--------------------------------------------------------\n`;
  text += `5. 보완 발문 제안 (Complementary Questions)\n`;
  text += `--------------------------------------------------------\n`;
  text += `[도입 및 생각 열기 발문]\n`;
  complementaryQuestions.introduction.forEach((q) => (text += `  · ${q}\n`));
  text += `[오개념 교정 발문]\n`;
  complementaryQuestions.misconceptionCorrection.forEach((q) => (text += `  · ${q}\n`));
  text += `[심화 및 확장 발문]\n`;
  complementaryQuestions.advancedExtension.forEach((q) => (text += `  · ${q}\n`));

  text += `\n※ 본 설계안은 AI가 생성한 '초안'이며 교사의 최종 교육과정 검토 후 사용하십시오.\n`;

  return text;
}

export function formatPlanAsHtml(plan: LessonPlanData): string {
  const { inputParams, deconstruction, alignmentAudit, lessonCards, rubric, complementaryQuestions } = plan;

  let html = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px;">`;
  html += `<h1 style="border-bottom: 2px solid #3b82f6; padding-bottom: 8px; color: #1e3a8a;">[수업 설계안] ${plan.title || inputParams.achievementStandardContent}</h1>`;

  html += `<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f8fafc;">`;
  html += `<tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; width: 120px;">성취기준</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${inputParams.achievementStandardCode} ${inputParams.achievementStandardContent}</td></tr>`;
  html += `<tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">대상 및 차시</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${inputParams.learnerPersona.targetGrade} / ${inputParams.lessonCount}차시</td></tr>`;
  html += `<tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">평가 방식</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${inputParams.assessmentMethod}</td></tr>`;
  html += `</table>`;

  html += `<h2 style="color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 8px;">1. 성취기준 분해</h2>`;
  html += `<ul>`;
  html += `<li><b>이해(Knowledge):</b> ${deconstruction.knowledgeUnderstanding}</li>`;
  html += `<li><b>적용(Skill):</b> ${deconstruction.application}</li>`;
  html += `<li><b>설명(Attitude/Reflection):</b> ${deconstruction.explanation}</li>`;
  html += `</ul>`;

  html += `<h2 style="color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 8px;">2. 목표-활동-평가 정합성 점검 (점수: ${alignmentAudit.alignmentScore}/100)</h2>`;
  html += `<p style="background: #eff6ff; padding: 10px; border-radius: 6px;"><b>종합평가:</b> ${alignmentAudit.summaryNote}</p>`;

  html += `<h2 style="color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 8px;">3. 차시별 설계 카드</h2>`;
  lessonCards.forEach((card) => {
    html += `<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px; background-color: #ffffff;">`;
    html += `<h3 style="margin-top: 0; color: #0f172a;">${card.lessonNumber}차시: ${card.topic}</h3>`;
    html += `<p><b>차시 목표:</b> ${card.objective}</p>`;
    html += `<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">`;
    html += `<tr style="background-color: #f1f5f9;"><th style="padding: 6px; border: 1px solid #cbd5e1; width: 80px;">구분</th><th style="padding: 6px; border: 1px solid #cbd5e1;">주요 활동 내용</th></tr>`;
    html += `<tr><td style="padding: 6px; border: 1px solid #cbd5e1; font-weight: bold; text-align: center;">도입</td><td style="padding: 6px; border: 1px solid #cbd5e1;">${card.activities.introduction}</td></tr>`;
    html += `<tr><td style="padding: 6px; border: 1px solid #cbd5e1; font-weight: bold; text-align: center;">전개</td><td style="padding: 6px; border: 1px solid #cbd5e1;">${card.activities.development}</td></tr>`;
    html += `<tr><td style="padding: 6px; border: 1px solid #cbd5e1; font-weight: bold; text-align: center;">정리</td><td style="padding: 6px; border: 1px solid #cbd5e1;">${card.activities.summary}</td></tr>`;
    html += `</table>`;
    html += `<p><b>평가 계획:</b> [${card.assessment.method}] ${card.assessment.criteria}</p>`;
    html += `<p style="font-size: 13px; color: #475569;"><b>맞춤 지원:</b> (상위 20%) ${card.personaSupport.highMaturity} / (하위 30%) ${card.personaSupport.lowMaturity}</p>`;
    html += `</div>`;
  });

  html += `<h2 style="color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 8px;">4. 수행 루브릭 초안</h2>`;
  html += `<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">`;
  html += `<tr style="background-color: #1e3a8a; color: white;"><th style="padding: 8px; border: 1px solid #cbd5e1; width: 25%;">평가 요소</th><th style="padding: 8px; border: 1px solid #cbd5e1; width: 25%;">상 (우수)</th><th style="padding: 8px; border: 1px solid #cbd5e1; width: 25%;">중 (보통)</th><th style="padding: 8px; border: 1px solid #cbd5e1; width: 25%;">하 (기초)</th></tr>`;
  rubric.criteria.forEach((crit) => {
    html += `<tr>`;
    html += `<td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; background-color: #f8fafc;">${crit.element}</td>`;
    html += `<td style="padding: 8px; border: 1px solid #cbd5e1;">${crit.high}</td>`;
    html += `<td style="padding: 8px; border: 1px solid #cbd5e1;">${crit.medium}</td>`;
    html += `<td style="padding: 8px; border: 1px solid #cbd5e1;">${crit.low}</td>`;
    html += `</tr>`;
  });
  html += `</table>`;

  html += `<h2 style="color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 8px;">5. 보완 발문 제안</h2>`;
  html += `<p><b>[도입 발문]</b></p><ul>` + complementaryQuestions.introduction.map((q) => `<li>${q}</li>`).join('') + `</ul>`;
  html += `<p><b>[오개념 교정 발문]</b></p><ul>` + complementaryQuestions.misconceptionCorrection.map((q) => `<li>${q}</li>`).join('') + `</ul>`;
  html += `<p><b>[심화 확장 발문]</b></p><ul>` + complementaryQuestions.advancedExtension.map((q) => `<li>${q}</li>`).join('') + `</ul>`;

  html += `<p style="margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 10px;">※ 본 설계안은 AI가 생성한 '초안'이며 교사의 최종 교육과정 검토 후 사용하십시오.</p>`;
  html += `</div>`;

  return html;
}

export function downloadTextFile(filename: string, content: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
