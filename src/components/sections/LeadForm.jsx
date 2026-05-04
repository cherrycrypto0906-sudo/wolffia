import React, { useState } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { Button } from '../UI/Button';
import { useTranslation } from 'react-i18next';
import './LeadForm.css';

const PERSONA_OPTIONS = [
  'Dân văn phòng bận rộn',
  'Mẹ bỉm muốn chuẩn bị bữa nhanh mà đủ chất',
  'Người ăn chay / plant-based',
  'Người tập luyện muốn bổ sung dinh dưỡng xanh',
  'Người lười ăn rau nhưng vẫn muốn khỏe',
];

const CHALLENGE_OPTIONS = [
  'Không có thời gian chuẩn bị bữa ăn',
  'Khó ăn đủ rau mỗi ngày',
  'Muốn ăn lành mạnh hơn nhưng chưa biết bắt đầu từ đâu',
  'Cần món nhanh, gọn mà vẫn đủ chất',
  'Muốn đổi bữa cho đỡ ngán',
];

const BENEFIT_OPTIONS = [
  'Ăn xanh dễ hơn mỗi ngày',
  'Có thêm đạm thực vật và dinh dưỡng tự nhiên',
  'Chuẩn bị bữa ăn nhanh hơn',
  'Hỗ trợ giữ dáng, đẹp da, nhẹ bụng',
  'Có thêm lựa chọn lành mạnh cho cả nhà',
];

const GIFT_OPTIONS = [
  'Có, gửi mình ngay nhé',
  'Có, nhưng mình muốn xem thêm thông tin trước',
  'Hiện tại mình chưa cần',
];

export const LeadForm = () => {
  const { t } = useTranslation();
  
  const personaRaw = t('leadForm.form.options.persona', { returnObjects: true });
  const PERSONA_OPTIONS = Array.isArray(personaRaw) ? personaRaw : [];
  
  const challengeRaw = t('leadForm.form.options.challenges', { returnObjects: true });
  const CHALLENGE_OPTIONS = Array.isArray(challengeRaw) ? challengeRaw : [];
  
  const benefitRaw = t('leadForm.form.options.benefits', { returnObjects: true });
  const BENEFIT_OPTIONS = Array.isArray(benefitRaw) ? benefitRaw : [];
  
  const giftRaw = t('leadForm.form.options.gifts', { returnObjects: true });
  const GIFT_OPTIONS = Array.isArray(giftRaw) ? giftRaw : [];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    persona: '',
    challenges: [],
    desiredBenefit: '',
    giftInterest: '',
    note: '',
  });
  const [step, setStep] = useState('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasJoinedZalo, setHasJoinedZalo] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChallengeChange = (option) => {
    setFormData((prev) => {
      const exists = prev.challenges.includes(option);
      return {
        ...prev,
        challenges: exists
          ? prev.challenges.filter((item) => item !== option)
          : [...prev.challenges, option],
      };
    });
  };

  const buildSubmissionPayload = () => ({
    name: formData.name,
    email: formData.email,
    phone: '',
    zalo: '',
    location: '',
    packageName: 'Cookbook survey',
    quantity: 1,
    depositAmount: 0,
    submissionStatus: 'cookbook_survey',
    surveyName: 'Wolffia Cookbook Survey',
    leadSource: 'landing_page',
    note: `Nhu cầu: ${formData.persona}\nKhó khăn: ${formData.challenges.join(', ')}\nMục tiêu: ${formData.desiredBenefit}\nNhận quà: ${formData.giftInterest}\nGhi chú: ${formData.note}`,
    destinationSheet: CONFIG.sheetUrl,
    submittedAt: new Date().toISOString(),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await fetch(CONFIG.formDestination, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildSubmissionPayload()),
        mode: 'no-cors',
      });

      const emailResponse = await fetch('/api/email-sequence-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      });

      const emailPayload = await emailResponse.json();

      if (!emailResponse.ok || !emailPayload?.ok) {
        throw new Error(emailPayload?.message || 'Không gửi được email tự động');
      }

      setTimeout(() => {
        setStep('zalo');
        setIsSubmitting(false);
      }, 800);
    } catch (error) {
      console.error('Survey submission error:', error);
      setIsSubmitting(false);
      alert('Lỗi gửi dữ liệu: ' + error.message);
    }
  };

  const scrollToPayment = () => {
    window.location.href = '/thanhtoan';
  };

  return (
    <section id="gift-survey" className="form-section section-padding">
      <div className="container form-container">
        <div className="gift-layout">
          {step === 'form' && (
            <>
              <div className="gift-info-card">
                <span className="form-kicker">{t('leadForm.giftInfo.kicker')}</span>
                <h2>{t('leadForm.giftInfo.headline')}</h2>
                <p>{t('leadForm.giftInfo.subheadline')}</p>

                <div className="gift-info-box">
                  <h3>{t('leadForm.giftInfo.processTitle')}</h3>
                  <ul>
                    {(Array.isArray(t('leadForm.giftInfo.steps', { returnObjects: true })) ? t('leadForm.giftInfo.steps', { returnObjects: true }) : []).map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="form-wrapper gift-main-card">
                <div className="form-header text-center">
                  <span className="form-kicker">{t('leadForm.form.kicker')}</span>
                  <h2>{t('leadForm.form.headline')}</h2>
                  <p>{t('leadForm.form.subheadline')}</p>
                </div>

                <form className="lead-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>{t('leadForm.form.labels.name')}</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('leadForm.form.labels.namePlaceholder')}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('leadForm.form.labels.email')}</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('leadForm.form.labels.emailPlaceholder')}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('leadForm.form.labels.persona')}</label>
                    <select name="persona" required value={formData.persona} onChange={handleChange}>
                      <option value="" disabled>{t('leadForm.form.labels.personaPlaceholder')}</option>
                      {PERSONA_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t('leadForm.form.labels.challenge')}</label>
                    <div className="deposit-options survey-options checkbox-options">
                      {CHALLENGE_OPTIONS.map((option) => (
                        <label key={option} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.challenges.includes(option)}
                            onChange={() => handleChallengeChange(option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      type="hidden"
                      name="challenge"
                      value={formData.challenges.join(', ')}
                      required={formData.challenges.length === 0}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('leadForm.form.labels.benefit')}</label>
                    <select name="desiredBenefit" required value={formData.desiredBenefit} onChange={handleChange}>
                      <option value="" disabled>{t('leadForm.form.labels.benefitPlaceholder')}</option>
                      {BENEFIT_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t('leadForm.form.labels.gift')}</label>
                    <div className="deposit-options survey-options">
                      {GIFT_OPTIONS.map((option) => (
                        <label key={option} className="radio-label">
                          <input
                            type="radio"
                            name="giftInterest"
                            value={option}
                            checked={formData.giftInterest === option}
                            onChange={handleChange}
                            required
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t('leadForm.form.labels.note')}</label>
                    <textarea
                      name="note"
                      rows="3"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder={t('leadForm.form.labels.notePlaceholder')}
                    />
                  </div>

                  <Button type="submit" className="w-100 btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? t('leadForm.form.labels.submitting') : t('leadForm.form.labels.submit')}
                  </Button>
                </form>
              </div>
            </>
          )}

          {step === 'zalo' && (
            <div className="form-wrapper gift-step-card gift-step-single">
              <div className="success-state text-center">
                <div className="success-icon">✅</div>
                <h3>{t('leadForm.zaloStep.headline')}</h3>
                <p>{t('leadForm.zaloStep.subheadline')}</p>

                <div className="success-zalo-box">
                  <p>{t('leadForm.zaloStep.boxText')}</p>
                  <a href={CONFIG.zaloLink} target="_blank" rel="noreferrer" className="btn btn-outline gift-zalo-btn">
                    {t('leadForm.zaloStep.joinBtn')}
                  </a>
                  <button type="button" onClick={() => { setHasJoinedZalo(true); setStep('download'); }} className="btn btn-primary w-100 mt-3">
                    {t('leadForm.zaloStep.joinedBtn')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'download' && hasJoinedZalo && (
            <div className="form-wrapper gift-step-card gift-step-single">
              <div className="success-state text-center">
                <div className="success-icon">🎁</div>
                <h3>{t('leadForm.downloadStep.headline')}</h3>
                <p>{t('leadForm.downloadStep.subheadline')}</p>

                <div className="success-zalo-box">
                  <a href="/api/cookbook-pdf" className="btn btn-primary w-100 mt-3">
                    {t('leadForm.downloadStep.downloadBtn')}
                  </a>
                  <button type="button" onClick={scrollToPayment} className="btn btn-outline w-100 mt-3">
                    {t('leadForm.downloadStep.orderBtn')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
