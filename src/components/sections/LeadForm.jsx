import React, { useState } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { Button } from '../UI/Button';
import './LeadForm.css';

const PERSONA_OPTIONS = [
  'Dân văn phòng bận rộn',
  'Mẹ bỉm muốn chuẩn bị bữa nhanh mà đủ chất',
  'Người ăn chay / plant-based',
  'Người tập luyện muốn bổ sung dinh dưỡng xanh',
  'Người lười ăn rau nhưng vẫn muốn khỏe'
];

const CHALLENGE_OPTIONS = [
  'Không có thời gian chuẩn bị bữa ăn',
  'Khó ăn đủ rau mỗi ngày',
  'Muốn ăn lành mạnh hơn nhưng chưa biết bắt đầu từ đâu',
  'Cần món nhanh, gọn mà vẫn đủ chất',
  'Muốn đổi bữa cho đỡ ngán'
];

const BENEFIT_OPTIONS = [
  'Ăn xanh dễ hơn mỗi ngày',
  'Có thêm đạm thực vật và dinh dưỡng tự nhiên',
  'Chuẩn bị bữa ăn nhanh hơn',
  'Hỗ trợ giữ dáng, đẹp da, nhẹ bụng',
  'Có thêm lựa chọn lành mạnh cho cả nhà'
];

const GIFT_OPTIONS = [
  'Có, gửi mình ngay nhé',
  'Có, nhưng mình muốn xem thêm thông tin trước',
  'Hiện tại mình chưa cần'
];

export const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    persona: '',
    challenges: [],
    desiredBenefit: '',
    giftInterest: '',
    note: ''
  });
  const [step, setStep] = useState('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChallengeChange = (option) => {
    setFormData((prev) => {
      const exists = prev.challenges.includes(option);
      return {
        ...prev,
        challenges: exists
          ? prev.challenges.filter((item) => item !== option)
          : [...prev.challenges, option]
      };
    });
  };

  const buildSubmissionPayload = () => ({
    ...formData,
    submissionStatus: 'cookbook_survey',
    surveyName: 'Wolffia Cookbook Survey',
    leadSource: 'landing_page',
    destinationSheet: CONFIG.sheetUrl,
    submittedAt: new Date().toISOString()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await fetch(CONFIG.formDestination, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildSubmissionPayload()),
        mode: 'no-cors'
      });

      setTimeout(() => {
        setStep('success');
        setIsSubmitting(false);
      }, 800);
    } catch (err) {
      console.error('Survey submission error:', err);
      setIsSubmitting(false);
      alert('Lỗi gửi dữ liệu: ' + err.message);
    }
  };

  return (
    <section id="lead-form" className="form-section section-padding">
      <div className="container form-container">
        <div className="form-wrapper">
          <div className="form-header text-center">
            <span className="form-kicker">Khảo sát nhận quà tặng</span>
            <h2>Nhận Cookbook món ngon với Wolffia</h2>
            <p>Điền nhanh 5 câu hỏi ngắn để Diệp Châu gửi bạn file cookbook với các món ăn nhanh, gọn, đủ chất và dễ áp dụng mỗi ngày.</p>
          </div>

          {step === 'form' && (
            <form className="lead-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên của bạn *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên của bạn"
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại / Zalo *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại hoặc Zalo"
                />
              </div>

              <div className="form-group">
                <label>Bạn thuộc nhóm nào dưới đây? *</label>
                <select name="persona" required value={formData.persona} onChange={handleChange}>
                  <option value="" disabled>Chọn nhóm phù hợp nhất</option>
                  {PERSONA_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Khó khăn lớn nhất của bạn khi ăn uống hằng ngày là gì? *</label>
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
                <label>Nếu có Wolffia tươi dễ dùng trong 30 giây, bạn muốn nó giúp mình điều gì nhất? *</label>
                <select name="desiredBenefit" required value={formData.desiredBenefit} onChange={handleChange}>
                  <option value="" disabled>Chọn điều bạn quan tâm nhất</option>
                  {BENEFIT_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Bạn có muốn nhận file Cookbook các món ngon, nhanh, gọn, đủ chất với Wolffia không? *</label>
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
                <label>Bạn muốn Diệp Châu chia sẻ thêm điều gì trong cookbook? (không bắt buộc)</label>
                <textarea
                  name="note"
                  rows="3"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Ví dụ: món cho bữa sáng, smoothie, món cho bé, món ăn chay..."
                />
              </div>

              <Button type="submit" className="w-100 btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi khảo sát...' : 'Nhận cookbook miễn phí'}
              </Button>
            </form>
          )}

          {step === 'success' && (
            <div className="success-state text-center">
              <div className="success-icon">✅</div>
              <h3>Diệp Châu đã nhận thông tin của bạn</h3>
              <p>Cookbook sẽ được gửi đến số điện thoại hoặc Zalo bạn vừa để lại. Cảm ơn bạn đã dành 1 phút để chia sẻ nhu cầu của mình.</p>

              <div className="success-zalo-box">
                <p>Nếu muốn theo dõi thêm mẹo ăn xanh nhanh gọn và các đợt mở bán Wolffia tươi, bạn có thể vào cộng đồng Zalo tại đây.</p>
                <a href={CONFIG.zaloLink} target="_blank" rel="noreferrer" className="btn btn-primary w-100 mt-3">
                  Vào cộng đồng Zalo
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
