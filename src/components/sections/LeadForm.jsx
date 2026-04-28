import React, { useState } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { Button } from '../UI/Button';
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
                <span className="form-kicker">Nhận quà tặng</span>
                <h2>Khảo sát nhanh để nhận cookbook miễn phí</h2>
                <p>Điền khảo sát ngắn, tham gia nhóm Zalo rồi tải file PDF ngay trên website.</p>

                <div className="gift-info-box">
                  <h3>Quy trình nhận quà</h3>
                  <ul>
                    <li>Bước 1: điền khảo sát để Diệp Châu hiểu nhu cầu của bạn</li>
                    <li>Bước 2: tham gia nhóm Zalo để theo dõi món thật và đợt mở hàng</li>
                    <li>Bước 3: mở nút tải file PDF cookbook ngay trên web</li>
                  </ul>
                </div>
              </div>

              <div className="form-wrapper gift-main-card">
                <div className="form-header text-center">
                  <span className="form-kicker">Khảo sát nhận quà tặng</span>
                  <h2>Nhận Cookbook món ngon với Wolffia</h2>
                  <p>Điền nhanh vài câu để Diệp Châu gửi quà đúng nhu cầu của bạn qua email.</p>
                </div>

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
                    <label>Email để nhận quà *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email của bạn"
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
                    <label>Nếu có Wolffia tươi dễ dùng, bạn muốn nó giúp mình điều gì nhất? *</label>
                    <select name="desiredBenefit" required value={formData.desiredBenefit} onChange={handleChange}>
                      <option value="" disabled>Chọn điều bạn quan tâm nhất</option>
                      {BENEFIT_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Bạn có muốn nhận cookbook miễn phí không? *</label>
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
                      placeholder="Ví dụ: món cho bữa sáng, món cho bé, smoothie, eat-clean..."
                    />
                  </div>

                  <Button type="submit" className="w-100 btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang gửi khảo sát...' : 'Nhận quà tặng'}
                  </Button>
                </form>
              </div>
            </>
          )}

          {step === 'zalo' && (
            <div className="form-wrapper gift-step-card gift-step-single">
              <div className="success-state text-center">
                <div className="success-icon">✅</div>
                <h3>Khảo sát đã xong</h3>
                <p>Tham gia nhóm Zalo trước, sau đó xác nhận để mở trang tải PDF.</p>

                <div className="success-zalo-box">
                  <p>Vào nhóm Zalo để xem món thật, feedback thật và cập nhật đợt hàng mới.</p>
                  <a href={CONFIG.zaloLink} target="_blank" rel="noreferrer" className="btn btn-outline gift-zalo-btn">
                    Tham gia nhóm Zalo
                  </a>
                  <button type="button" onClick={() => { setHasJoinedZalo(true); setStep('download'); }} className="btn btn-primary w-100 mt-3">
                    Tôi đã tham gia Zalo
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'download' && hasJoinedZalo && (
            <div className="form-wrapper gift-step-card gift-step-single">
              <div className="success-state text-center">
                <div className="success-icon">🎁</div>
                <h3>Quà của bạn đã sẵn sàng</h3>
                <p>Bạn có thể tải file PDF ngay bên dưới. Nếu muốn đặt hàng luôn thì đi tiếp xuống phần đặt hàng.</p>

                <div className="success-zalo-box">
                  <a href="/api/cookbook-pdf" className="btn btn-primary w-100 mt-3">
                    Tải file PDF
                  </a>
                  <button type="button" onClick={scrollToPayment} className="btn btn-outline w-100 mt-3">
                    Đi đến phần đặt hàng
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
