import React, { useState } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { Button } from '../UI/Button';
import './LeadForm.css';

export const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zalo: '',
    location: '',
    packageId: CONFIG.packages[0]?.id || 'goi1',
    quantity: '1',
    depositType: 'free',
    note: ''
  });

  const [step, setStep] = useState('form'); // 'form' | 'payment' | 'success'

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép ${type}: ${text}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.depositType === 'deposit') {
      setStep('payment');
    } else {
      // Send form data to Google Apps Script
      console.log('Sending data to:', CONFIG.formDestination);
      console.log('Form data:', formData);
      
      fetch(CONFIG.formDestination, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        mode: 'no-cors'
      })
      .then(response => {
        console.log('Response:', response);
        setTimeout(() => {
          setStep('success');
        }, 800);
      })
      .catch(err => {
        console.error('Form submission error:', err);
        alert('Lỗi gửi dữ liệu: ' + err.message);
      });
    }
  };

  const handlePaymentConfirmed = () => {
    // Send form data to Google Apps Script after payment confirmation
    console.log('Sending payment data to:', CONFIG.formDestination);
    
    fetch(CONFIG.formDestination, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      mode: 'no-cors'
    })
    .then(response => {
      console.log('Payment response:', response);
      setTimeout(() => {
        setStep('success');
      }, 800);
    })
    .catch(err => {
      console.error('Payment form submission error:', err);
      alert('Lỗi gửi dữ liệu: ' + err.message);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sepayInfo = CONFIG.sepayConfig;
  const qrUrl = `https://img.vietqr.io/image/${sepayInfo.bankId}-${sepayInfo.accountNumber}-compact2.png?amount=${sepayInfo.depositAmount}&addInfo=${encodeURIComponent(formData.phone)}&accountName=${encodeURIComponent(sepayInfo.accountName)}`;

  return (
    <section id="lead-form" className="form-section section-padding">
      <div className="container form-container">
        <div className="form-wrapper">
          <div className="form-header text-center">
            <h2>Giữ chỗ Wolffia tươi từ Diệp Châu</h2>
            <p>Nếu bạn cũng muốn ăn tốt hơn theo cách gọn hơn, nhanh hơn và đỡ mệt hơn, hãy để lại thông tin để Diệp Châu giữ suất cho bạn.</p>
          </div>

          {step === 'form' && (
            <form className="lead-form" onSubmit={handleSubmit}>
              <div className="form-group row">
                <div className="col">
                  <label>Họ và tên *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Nhập tên của bạn" />
                </div>
                <div className="col">
                  <label>Số điện thoại *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="VD: 09xx xxx xxx" />
                </div>
              </div>

              <div className="form-group row">
                <div className="col">
                  <label>Zalo (nếu khác sđt)</label>
                  <input type="tel" name="zalo" value={formData.zalo} onChange={handleChange} placeholder="Số Zalo của bạn" />
                </div>
                <div className="col">
                  <label>Khu vực nhận hàng *</label>
                  <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="Quận/Huyện, TP" />
                </div>
              </div>

              <div className="form-group">
                <label>Gói quan tâm *</label>
                <select name="packageId" required value={formData.packageId} onChange={handleChange}>
                  <option value="" disabled>-- Chọn gói sản phẩm --</option>
                  {CONFIG.packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.price}đ</option>
                  ))}
                </select>
              </div>

              <div className="form-group row align-center">
                <div className="col">
                  <label>Số lượng mong muốn</label>
                  <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group deposit-options">
                <label className="radio-label">
                  <input type="radio" name="depositType" value="free" checked={formData.depositType === 'free'} onChange={handleChange} />
                  <span><strong>Giữ chỗ miễn phí</strong> (Sẽ nhận thông báo khi có hàng)</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="depositType" value="deposit" checked={formData.depositType === 'deposit'} onChange={handleChange} />
                  <span><strong>Đặt cọc 29.000đ</strong> (Ưu tiên giao sớm, trừ vào đơn hàng)</span>
                </label>
              </div>

              <div className="form-group">
                <label>Ghi chú thêm (nếu có)</label>
                <textarea name="note" rows="3" value={formData.note} onChange={handleChange} placeholder="Thời gian nhận hàng mong muốn..."></textarea>
              </div>

              <Button type="submit" className="w-100 btn-submit">
                Giữ chỗ ngay
              </Button>
            </form>
          )}

          {step === 'payment' && (
            <div className="payment-state text-center">
              <div className="payment-badge">Chờ thanh toán cọc</div>
              <h3>Quét mã QR để hoàn tất</h3>
              <p className="payment-subtitle">Hệ thống sẽ tự động xác nhận sau khi nhận được 29.000đ từ bạn.</p>
              
              <div className="qr-container">
                <div className="qr-frame">
                  <img src={qrUrl} alt="Sepay QR Code" className="qr-image" />
                </div>
                
                <div className="bank-details-card mt-3">
                  <div className="detail-item" onClick={() => copyToClipboard(sepayInfo.accountNumber, 'Số tài khoản')}>
                    <span className="label">Số tài khoản:</span>
                    <span className="value">{sepayInfo.accountNumber}</span>
                    <span className="copy-hint">📋</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Ngân hàng:</span>
                    <span className="value">{sepayInfo.bankName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Số tiền:</span>
                    <span className="value highlight">{sepayInfo.depositAmount.toLocaleString()}đ</span>
                  </div>
                  <div className="detail-item" onClick={() => copyToClipboard(formData.phone, 'Số điện thoại')}>
                    <span className="label">Nội dung ck:</span>
                    <span className="value mono">{formData.phone}</span>
                    <span className="copy-hint">📋</span>
                  </div>
                </div>
              </div>

              <div className="payment-actions">
                <div className="info-alert">
                  💡 Sau khi chuyển khoản, bạn sẽ được đưa vào cộng đồng Zalo để theo dõi lịch giao hàng.
                </div>
                <Button className="w-100 btn-submit mt-3" onClick={handlePaymentConfirmed}>
                  Tôi đã chuyển khoản xong
                </Button>
                <button className="btn-back mt-3" onClick={() => setStep('form')}>← Thay đổi thông tin</button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="success-state text-center">
              <div className="success-icon">✅</div>
              <h3>Cảm ơn bạn đã giữ chỗ!</h3>
              <p>Diệp Châu đã nhận được thông tin của bạn. Chúng tôi sẽ liên hệ trong thời gian sớm nhất để xác nhận.</p>
              
              <div className="success-zalo-box">
                <p>Trong lúc chờ đợi, mời bạn tham gia cộng đồng Zalo để theo dõi đợt mở suất và xem lịch giao hàng nhé!</p>
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
