import React, { useEffect, useState } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { Button } from '../UI/Button';
import './LeadForm.css';
import qrPaymentImg from '../../assets/qr_payment_v3.jpg';

export const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zalo: '',
    location: '',
    packageId: CONFIG.packages[0]?.id || 'goi1',
    quantity: '1',
    depositType: 'free',
    note: '',
    screenshot: null,
    screenshotBase64: '',
    screenshotMimeType: '',
    screenshotUploadedAt: ''
  });
  const [step, setStep] = useState('form'); // 'form' | 'payment' | 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadingScreenshot, setIsReadingScreenshot] = useState(false);

  useEffect(() => {
    const handlePackageSelected = (event) => {
      if (!event?.detail) return;
      setFormData((prev) => ({ ...prev, packageId: event.detail }));
    };

    window.addEventListener('selectPackage', handlePackageSelected);
    return () => window.removeEventListener('selectPackage', handlePackageSelected);
  }, []);

  const selectedPackage = CONFIG.packages.find((pkg) => pkg.id === formData.packageId);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép ${type}: ${text}`);
  };

  const buildSubmissionPayload = (status) => ({
    ...formData,
    screenshot: undefined,
    screenshotFileName: formData.screenshot?.name || '',
    screenshotFileSize: formData.screenshot?.size || 0,
    packageName: selectedPackage?.name || '',
    packagePrice: selectedPackage?.price || '',
    depositAmount: formData.depositType === 'deposit' ? CONFIG.sepayConfig.depositAmount : 0,
    submissionStatus: status,
    submittedAt: new Date().toISOString(),
    destinationSheet: CONFIG.sheetUrl
  });

  const submitFormData = async (status) => {
    const payload = buildSubmissionPayload(status);

    await fetch(CONFIG.formDestination, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'no-cors'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (formData.depositType === 'deposit') {
      setStep('payment');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitFormData('free_reservation');
      setTimeout(() => {
        setStep('success');
        setIsSubmitting(false);
      }, 800);
    } catch (err) {
      console.error('Form submission error:', err);
      setIsSubmitting(false);
      alert('Lỗi gửi dữ liệu: ' + err.message);
    }
  };

  const handlePaymentConfirmed = async () => {
    if (!formData.screenshotBase64 || isSubmitting || isReadingScreenshot) {
      return;
    }

    try {
      setIsSubmitting(true);
      await submitFormData('deposit_paid');
      setTimeout(() => {
        setStep('success');
        setIsSubmitting(false);
      }, 800);
    } catch (err) {
      console.error('Payment form submission error:', err);
      setIsSubmitting(false);
      alert('Lỗi gửi dữ liệu: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sepayInfo = CONFIG.sepayConfig;
  const isPaymentConfirmDisabled = !formData.screenshotBase64 || isReadingScreenshot || isSubmitting;

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

              <Button type="submit" className="w-100 btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi thông tin...' : 'Giữ chỗ ngay'}
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
                  <img src={qrPaymentImg} alt="Mã QR chuyển khoản Techcombank" className="qr-image" />
                  <a href={qrPaymentImg} download="QR_Payment_DiepChau.jpg" className="btn-download-qr mt-2">
                    📥 Tải mã QR về máy
                  </a>
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
                  <div className="detail-item" onClick={() => copyToClipboard(`${formData.name} ${formData.phone}`, 'Nội dung')}>
                    <span className="label">Nội dung ck:</span>
                    <span className="value highlight-box">{formData.name} {formData.phone}</span>
                    <span className="copy-hint">📋</span>
                  </div>
                  <div className="transfer-note-alert mt-2">
                    ⚠️ <strong>Lưu ý:</strong> Nội dung chuyển khoản: Tên + Số điện thoại của bạn
                  </div>
                </div>

                <div className="screenshot-upload-section mt-4">
                  <label className="upload-label">
                    <div className="upload-icon">📸</div>
                    <div className="upload-text">
                      {formData.screenshot ? (
                        <span className="filename">{formData.screenshot.name}</span>
                      ) : (
                        <span>Tải ảnh/chụp màn hình xác nhận chuyển khoản</span>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setIsReadingScreenshot(true);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ 
                              ...prev, 
                              screenshot: {
                                name: file.name,
                                size: file.size
                              },
                              screenshotBase64: typeof reader.result === 'string' ? reader.result : '',
                              screenshotMimeType: file.type,
                              screenshotUploadedAt: new Date().toISOString()
                            }));
                            setIsReadingScreenshot(false);
                          };
                          reader.onerror = () => {
                            setIsReadingScreenshot(false);
                            alert('Không đọc được ảnh. Bạn vui lòng thử lại.');
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </label>
                  <p className="upload-hint">
                    {isReadingScreenshot
                      ? 'Đang xử lý ảnh xác nhận...'
                      : 'Ảnh sau khi tải lên sẽ được gửi sang Google Sheet để Diệp Châu đối soát nhanh hơn'}
                  </p>
                </div>
              </div>

              <div className="payment-actions">
                <div className="info-alert">
                  💡 Sau khi chuyển khoản, bạn sẽ được đưa vào cộng đồng Zalo để theo dõi lịch giao hàng.
                </div>
                <Button
                  className="w-100 btn-submit mt-3"
                  onClick={handlePaymentConfirmed}
                  disabled={isPaymentConfirmDisabled}
                >
                  {isSubmitting
                    ? 'Đang xác nhận thanh toán...'
                    : isReadingScreenshot
                      ? 'Đang tải ảnh lên...'
                      : 'Tôi đã chuyển khoản xong'}
                </Button>
                {isPaymentConfirmDisabled && !isSubmitting && (
                  <p className="payment-lock-hint">Vui lòng tải ảnh xác nhận chuyển khoản để mở nút thanh toán.</p>
                )}
                <a href={qrPaymentImg} download="QR_Payment_DiepChau.jpg" className="btn-download-qr mt-3">
                  📥 Tải mã QR về máy
                </a>
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
