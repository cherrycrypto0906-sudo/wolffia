import React, { useEffect, useMemo, useState } from 'react';
import { CONFIG } from '../../config/landingConfig';
import { Button } from '../UI/Button';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import './LeadForm.css';

const parsePrice = (value) => Number(String(value || '0').replace(/\./g, ''));
const normalizeTransferPart = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();

const slugTransferPart = (value) => normalizeTransferPart(value).replace(/\s+/g, '-');

const fallbackPackage = CONFIG.packages[0]?.id || '';
const PENDING_PAYMENT_KEY = 'pendingPaymentState';

export const PaymentSection = () => {
  const pendingPayment = (() => {
    try {
      return JSON.parse(window.sessionStorage.getItem(PENDING_PAYMENT_KEY) || 'null');
    } catch {
      return null;
    }
  })();

  const [selectedPackageId, setSelectedPackageId] = useState(() => pendingPayment?.selectedPackageId || window.sessionStorage.getItem('selectedPackageId') || fallbackPackage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(() => pendingPayment?.step || 'form');
  const [formData, setFormData] = useState({
    name: pendingPayment?.formData?.name || '',
    phone: pendingPayment?.formData?.phone || '',
    address: pendingPayment?.formData?.address || '',
    quantity: pendingPayment?.formData?.quantity || '1',
    note: pendingPayment?.formData?.note || '',
  });
  const [paymentStatus, setPaymentStatus] = useState(() => pendingPayment?.paymentStatus || 'pending_payment');

  const checkOrderStatus = async () => {
    try {
      const response = await fetch('/api/admin-db?resource=all');
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        return false;
      }

      const matchedOrder = (payload.data?.orders || []).find((order) => order.transfer_content === transferContent);

      if (matchedOrder?.status === 'paid') {
        setPaymentStatus('paid');
        setStep('paid');
        window.sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const handlePackageSelect = (event) => {
      if (event.detail) {
        setSelectedPackageId(event.detail);
        window.sessionStorage.setItem('selectedPackageId', event.detail);
      }
    };

    window.addEventListener('selectPackage', handlePackageSelect);
    return () => window.removeEventListener('selectPackage', handlePackageSelect);
  }, []);

  const selectedPackage = useMemo(
    () => CONFIG.packages.find((item) => item.id === selectedPackageId) || CONFIG.packages[0],
    [selectedPackageId]
  );

  const quantity = Math.max(1, Number(formData.quantity || 1));
  const amount = parsePrice(selectedPackage?.price) * quantity;
  const transferContent = [
    CONFIG.sepayConfig.transferPrefix,
    slugTransferPart(selectedPackage?.name),
    slugTransferPart(formData.name),
    slugTransferPart(formData.phone),
  ].filter(Boolean).join('-').slice(0, 120);
  const qrUrl = `https://img.vietqr.io/image/${CONFIG.sepayConfig.bankId}-${CONFIG.sepayConfig.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(CONFIG.sepayConfig.accountName)}`;
  const transferNote = `Chuyen khoan dung ${amount.toLocaleString('vi-VN')}đ va giu nguyen noi dung ${transferContent}`;

  useEffect(() => {
    const snapshot = {
      selectedPackageId,
      formData,
      step,
      paymentStatus,
    };

    if (step === 'form' && !formData.name && !formData.phone && !formData.address) {
      window.sessionStorage.removeItem(PENDING_PAYMENT_KEY);
      return;
    }

    window.sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(snapshot));
  }, [formData, paymentStatus, selectedPackageId, step]);

  useEffect(() => {
    if (step !== 'qr' || paymentStatus === 'paid') return undefined;

    let active = true;

    void checkOrderStatus();
    const intervalId = window.setInterval(() => {
      if (active) {
        void checkOrderStatus();
      }
    }, 1500);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [paymentStatus, step, transferContent]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (packageId) => {
    setSelectedPackageId(packageId);
    window.sessionStorage.setItem('selectedPackageId', packageId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await fetch(CONFIG.formDestination, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource: 'order_intake',
          name: formData.name,
          phone: formData.phone,
          zalo: '',
          location: formData.address,
          packageName: selectedPackage.name,
          packageId: selectedPackage.id,
          packageDescription: selectedPackage.description,
          unitPrice: parsePrice(selectedPackage?.price),
          quantity,
          depositAmount: amount,
          submissionStatus: 'qr_order',
          leadSource: 'payment_section',
          transferContent,
          note: `Địa chỉ: ${formData.address}\nSố lượng: ${quantity}\nGhi chú: ${formData.note}\nNội dung CK: ${transferContent}`,
          destinationSheet: CONFIG.sheetUrl,
          submittedAt: new Date().toISOString(),
        }),
        mode: 'no-cors',
      });

      setTimeout(() => {
        setPaymentStatus('pending_payment');
        setStep('qr');
        setIsSubmitting(false);
      }, 800);
    } catch (error) {
      console.error('Order submission error:', error);
      setIsSubmitting(false);
      alert('Lỗi gửi dữ liệu: ' + error.message);
    }
  };

  return (
    <section id="payment-section" className="form-section section-padding order-section">
      <div className="container form-container">
        <div className={`order-layout ${step === 'qr' ? 'qr-page' : 'order-single'}`}>
          {step === 'form' && (
          <div className="form-wrapper order-form-card">
            <div className="form-header text-center">
              <span className="form-kicker">Đặt hàng</span>
              <h2>Điền thông tin nhận hàng rồi thanh toán</h2>
              <p>Chọn gói, điền thông tin người nhận. Sau đó hệ thống sẽ hiện đúng mã QR và nội dung chuyển khoản cho đơn của bạn.</p>
            </div>

              <form className="lead-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Chọn gói muốn đặt *</label>
                  <div className="package-picker package-picker-single">
                    {CONFIG.packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        className={`package-chip ${selectedPackageId === pkg.id ? 'active' : ''}`}
                        onClick={() => handlePackageChange(pkg.id)}
                      >
                        <strong>{pkg.name}</strong>
                        <span>{pkg.price}đ</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên người nhận"
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại nhận hàng"
                  />
                </div>

                <div className="form-group">
                  <label>Số lượng *</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Nhập số lượng"
                  />
                </div>

                <div className="form-group">
                  <label>Địa chỉ nhận hàng *</label>
                  <textarea
                    name="address"
                    rows="3"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ nhận hàng đầy đủ"
                  />
                </div>

                <div className="form-group">
                  <label>Ghi chú thêm (không bắt buộc)</label>
                  <textarea
                    name="note"
                    rows="3"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Ví dụ: giao giờ nào tiện, gọi trước khi giao, lưu ý ship..."
                  />
                </div>

                <Button type="submit" className="w-100 btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu đơn...' : 'Đặt hàng ngay'}
                </Button>
              </form>
          </div>
          )}

          {step === 'qr' && (
            <RevealOnScroll className="form-wrapper payment-card payment-page-card">
              <div className="form-header text-center">
                <span className="form-kicker">Thanh toán SePay</span>
                <h2>Quét QR cho đơn hàng của bạn</h2>
                <p>Thông tin thanh toán đã sẵn sàng. Chỉ cần chuyển đúng như bên dưới.</p>
              </div>

              <div className="payment-state text-center">
                <div className="payment-badge">Đơn hàng: {selectedPackage.name}</div>
                <p className="payment-subtitle">{selectedPackage.description}</p>

                <div className="qr-container">
                  <div className="qr-frame">
                    <img src={qrUrl} alt={`QR thanh toán ${selectedPackage.name}`} className="qr-image" />
                  </div>

                  <div className="bank-details-card">
                    <div className="detail-item">
                      <span className="label">Ngân hàng</span>
                      <span className="value">{CONFIG.sepayConfig.bankName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Số tài khoản</span>
                      <span className="value mono">{CONFIG.sepayConfig.accountNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Chủ tài khoản</span>
                      <span className="value">{CONFIG.sepayConfig.accountName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Khách hàng</span>
                      <span className="value">{formData.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Số điện thoại</span>
                      <span className="value mono">{formData.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Số tiền</span>
                      <span className="value highlight">{amount.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Nội dung CK</span>
                      <span className="value mono">{transferContent}</span>
                    </div>
                  </div>

                  <div className="transfer-note-alert">
                    <strong>Lưu ý:</strong> {transferNote}. Nội dung chuyển khoản đang theo công thức <strong>{CONFIG.sepayConfig.transferPrefix} + tên gói + tên + số điện thoại</strong> và đã được nhúng trực tiếp vào mã QR. Vui lòng không sửa nội dung này.
                  </div>
                  <p className="payment-status-hint">Đang chờ xác nhận thanh toán từ ngân hàng...</p>
                  <div className="info-alert">
                    Sau khi bạn chuyển khoản xong, trang này sẽ tự cập nhật khi đơn hàng được xác nhận thanh toán.
                  </div>
                  <div className="payment-actions">
                    <Button onClick={() => { void checkOrderStatus(); }}>
                      Kiểm tra thanh toán
                    </Button>
                    <Button onClick={() => setStep('form')} variant="outline">
                      Sửa lại thông tin đơn hàng
                    </Button>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          )}

          {step === 'paid' && (
            <RevealOnScroll className="form-wrapper payment-card payment-page-card">
              <div className="success-state text-center">
                <div className="success-icon">🎉</div>
                <h3>Cherry đã nhận thanh toán của bạn rồi</h3>
                <p>Cảm ơn bạn nhiều nha. Bên Cherry sẽ chuẩn bị đơn <strong>{selectedPackage.name}</strong> và liên hệ lại sớm để chốt thời gian giao hàng phù hợp nhất.</p>
                <div className="success-zalo-box">
                  <p>Bạn cứ để ý điện thoại giúp Cherry. Nếu cần hỗ trợ thêm, chat ngay ở góc phải là được.</p>
                  <Button onClick={() => { setStep('form'); setPaymentStatus('pending_payment'); setFormData({ name: '', phone: '', address: '', quantity: '1', note: '' }); }} variant="outline">
                    Tạo đơn mới
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          )}
        </div>
      </div>
    </section>
  );
};
