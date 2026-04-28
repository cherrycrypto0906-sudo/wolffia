import React, { useEffect, useMemo, useState } from 'react';
import './AdminPanel.css';
import { CONFIG } from '../../config/landingConfig';

const INITIAL_DATA = {
  products: [],
  customers: [],
  orders: [],
};

const TABS = [
  { id: 'products', label: 'Sản phẩm' },
  { id: 'customers', label: 'Khách hàng' },
  { id: 'orders', label: 'Đơn hàng' },
];

const formatPrice = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;
const todayLocal = () => new Date().toISOString().slice(0, 10);

const productDefaults = {
  id: '',
  name: '',
  price: '0',
  description: '',
  stock_quantity: '0',
};

const customerDefaults = {
  id: '',
  name: '',
  phone: '',
  zalo: '',
  email: '',
  address: '',
  registered_at: todayLocal(),
};

const orderDefaults = {
  id: '',
  customer_id: '',
  customer_name: '',
  email: '',
  phone: '',
  product_id: '',
  product_name: '',
  quantity: '1',
  amount: '',
  status: 'paid',
  address: '',
  transfer_content: '',
  purchased_at: todayLocal(),
  note: '',
};

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [db, setDb] = useState(INITIAL_DATA);
  const [surveyLeads, setSurveyLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [productForm, setProductForm] = useState(productDefaults);
  const [customerForm, setCustomerForm] = useState(customerDefaults);
  const [orderForm, setOrderForm] = useState(orderDefaults);

  const loadDb = async () => {
    setLoading(true);
    setError('');

    try {
      const [response, leadsResponse] = await Promise.all([
        fetch('/api/admin-db?resource=all'),
        fetch('/api/admin-db?resource=survey_leads'),
      ]);
      const payload = await response.json();
      const leadsPayload = await leadsResponse.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message || 'Không tải được dữ liệu admin');
      }

      if (!leadsResponse.ok || !leadsPayload?.ok) {
        throw new Error(leadsPayload?.message || 'Không tải được dữ liệu khảo sát');
      }

      setDb({
        products: payload.data.products || [],
        customers: payload.data.customers || [],
        orders: payload.data.orders || [],
      });
      setSurveyLeads(leadsPayload.data || []);
    } catch (err) {
      setError(err.message || 'Không tải được dữ liệu admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDb();
  }, []);

  const productOptions = useMemo(
    () => db.products.map((product) => ({ ...product, stock_quantity: Number(product.stock_quantity || 0) })),
    [db.products]
  );

  const customerOptions = useMemo(() => db.customers, [db.customers]);

  const mergedCustomers = useMemo(() => {
    const items = [...db.customers.map((customer) => ({ ...customer, source: 'customer' }))];

    surveyLeads.forEach((lead) => {
      const existing = items.find((item) =>
        (lead.email && item.email === lead.email) || (lead.phone && item.phone === lead.phone)
      );

      if (existing) {
        if (!existing.email && lead.email) existing.email = lead.email;
        if (!existing.name && lead.name) existing.name = lead.name;
        return;
      }

      items.push({
        id: lead.id,
        name: lead.name || '',
        phone: lead.phone || '',
        zalo: '',
        email: lead.email || '',
        address: '',
        registered_at: lead.submittedAt || '',
        source: 'survey_lead',
      });
    });

    return items;
  }, [db.customers, surveyLeads]);

  useEffect(() => {
    if (!orderForm.product_id) return;
    const selectedProduct = productOptions.find((item) => item.id === orderForm.product_id);
    if (selectedProduct) {
      setOrderForm((prev) => ({
        ...prev,
        product_name: selectedProduct.name,
        amount: prev.amount || String(Number(selectedProduct.price || 0) * Number(prev.quantity || 1)),
      }));
    }
  }, [orderForm.product_id, orderForm.quantity, productOptions]);

  useEffect(() => {
    if (!orderForm.customer_id) return;
    const selectedCustomer = customerOptions.find((item) => item.id === orderForm.customer_id);
    if (selectedCustomer) {
      setOrderForm((prev) => ({
        ...prev,
        customer_name: selectedCustomer.name,
        email: selectedCustomer.email || '',
        phone: selectedCustomer.phone || '',
        address: prev.address || selectedCustomer.address || '',
      }));
    }
  }, [orderForm.customer_id, customerOptions]);

  const saveRecord = async (body) => {
    setSaving(true);
    setError('');

    try {
      await fetch(CONFIG.formDestination, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        mode: 'no-cors',
      });

      await new Promise((resolve) => setTimeout(resolve, 900));
      await loadDb();
      return body.record || null;
    } catch (err) {
      setError(err.message || 'Không lưu được dữ liệu');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    await saveRecord({
      resource: 'products',
      action: productForm.id ? 'update' : 'create',
      record: {
        ...productForm,
        price: Number(productForm.price || 0),
        stock_quantity: Number(productForm.stock_quantity || 0),
      },
    });
    setProductForm(productDefaults);
  };

  const submitCustomer = async (event) => {
    event.preventDefault();
    await saveRecord({
      resource: 'customers',
      action: customerForm.id ? 'update' : 'create',
      record: customerForm,
    });
    setCustomerForm(customerDefaults);
  };

  const submitOrder = async (event) => {
    event.preventDefault();

    const customerEmail = orderForm.email || customerOptions.find((customer) => customer.id === orderForm.customer_id)?.email;

    if (orderForm.customer_id && customerEmail) {
      const selectedCustomer = customerOptions.find((customer) => customer.id === orderForm.customer_id);

      if (selectedCustomer && selectedCustomer.email !== customerEmail) {
        await saveRecord({
          resource: 'customers',
          action: 'update',
          record: {
            ...selectedCustomer,
            email: customerEmail,
          },
        });
      }
    }

    const savedOrder = await saveRecord({
      resource: 'orders',
      action: orderForm.id ? 'update' : 'create',
      record: {
        ...orderForm,
        quantity: Number(orderForm.quantity || 1),
        amount: Number(orderForm.amount || 0),
      },
    });

    if (customerEmail) {
      try {
        const emailResponse = await fetch('/api/order-confirmation-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: customerEmail,
            name: orderForm.customer_name,
            productName: orderForm.product_name,
            amount: Number(orderForm.amount || 0),
            address: orderForm.address,
            orderId: savedOrder?.id,
          }),
        });

        const emailPayload = await emailResponse.json();
        if (!emailResponse.ok || !emailPayload?.ok) {
          throw new Error(emailPayload?.message || 'Không gửi được email xác nhận đơn hàng');
        }
      } catch (error) {
        console.error('Order confirmation email error:', error);
        setError(error.message || 'Không gửi được email xác nhận đơn hàng');
      }
    }

    setOrderForm(orderDefaults);
  };

  const markOrderPaid = async (order) => {
    await saveRecord({
      resource: 'orders',
      action: 'update',
      record: {
        ...order,
        quantity: Number(order.quantity || 1),
        amount: Number(order.amount || 0),
        status: 'paid',
      },
    });
  };

  const removeRecord = async (resource, id) => {
    await saveRecord({ resource, action: 'delete', id });
  };

  return (
    <div className="admin-page">
      <div className="admin-shell container">
        <div className="admin-hero">
          <div>
            <p className="admin-kicker">/admin</p>
            <h1>Admin panel bán hàng</h1>
            <p>Quản lý sản phẩm, khách hàng và đơn hàng bằng dữ liệu chung. Truy cập ở trình duyệt nào cũng thấy cùng một dữ liệu.</p>
          </div>
          <a href="/" className="btn btn-outline">Về website</a>
        </div>

        {error && <div className="admin-list-card" style={{ color: '#b42318' }}>{error}</div>}

        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? <div className="admin-list-card">Đang tải dữ liệu...</div> : null}

        {!loading && activeTab === 'products' && (
          <section className="admin-section">
            <form className="admin-form" onSubmit={(e) => { void submitProduct(e); }}>
              <h2>{productForm.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
              <input value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Tên sản phẩm" required />
              <input value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} type="number" min="0" placeholder="Giá bán" required />
              <input value={productForm.stock_quantity} onChange={(e) => setProductForm((prev) => ({ ...prev, stock_quantity: e.target.value }))} type="number" min="0" placeholder="Số lượng còn lại" required />
              <textarea value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Mô tả ngắn" rows="4" />
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>{productForm.id ? 'Lưu sản phẩm' : 'Thêm mới'}</button>
                {productForm.id && <button type="button" className="btn btn-outline" onClick={() => setProductForm(productDefaults)}>Hủy chỉnh sửa</button>}
              </div>
            </form>

            <div className="admin-list-card">
              <h2>Danh sách sản phẩm</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Tên</th><th>Giá</th><th>Tồn kho</th><th>Mô tả</th><th></th></tr>
                  </thead>
                  <tbody>
                    {db.products.length === 0 && <tr><td colSpan="5">Chưa có sản phẩm nào.</td></tr>}
                    {db.products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{product.stock_quantity}</td>
                        <td>{product.description || 'Không có mô tả'}</td>
                        <td className="table-actions">
                          <button type="button" onClick={() => setProductForm({ ...product, price: String(product.price), stock_quantity: String(product.stock_quantity) })}>Sửa</button>
                          <button type="button" onClick={() => { void removeRecord('products', product.id); }}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {!loading && activeTab === 'customers' && (
          <section className="admin-section">
            <form className="admin-form" onSubmit={(e) => { void submitCustomer(e); }}>
              <h2>{customerForm.id ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng'}</h2>
              <input value={customerForm.name} onChange={(e) => setCustomerForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Tên khách hàng" required />
              <input value={customerForm.phone} onChange={(e) => setCustomerForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Số điện thoại" />
              <input value={customerForm.zalo} onChange={(e) => setCustomerForm((prev) => ({ ...prev, zalo: e.target.value }))} placeholder="Zalo" />
              <input value={customerForm.email} onChange={(e) => setCustomerForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" />
              <textarea value={customerForm.address} onChange={(e) => setCustomerForm((prev) => ({ ...prev, address: e.target.value }))} placeholder="Địa chỉ" rows="3" />
              <input value={customerForm.registered_at} onChange={(e) => setCustomerForm((prev) => ({ ...prev, registered_at: e.target.value }))} type="date" required />
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>{customerForm.id ? 'Lưu khách hàng' : 'Thêm mới'}</button>
                {customerForm.id && <button type="button" className="btn btn-outline" onClick={() => setCustomerForm(customerDefaults)}>Hủy chỉnh sửa</button>}
              </div>
            </form>

            <div className="admin-list-card">
              <h2>Danh sách khách hàng</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Tên</th><th>Điện thoại</th><th>Email</th><th>Địa chỉ</th><th></th></tr>
                  </thead>
                  <tbody>
                    {mergedCustomers.length === 0 && <tr><td colSpan="5">Chưa có khách hàng nào.</td></tr>}
                    {mergedCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td>{customer.name}</td>
                        <td>{customer.phone || '-'}</td>
                        <td>{customer.email || '-'}</td>
                        <td>{customer.address || '-'}</td>
                        <td className="table-actions">
                          {customer.source !== 'survey_lead' && (
                            <>
                              <button type="button" onClick={() => setCustomerForm(customer)}>Sửa</button>
                              <button type="button" onClick={() => { void removeRecord('customers', customer.id); }}>Xóa</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {!loading && activeTab === 'orders' && (
          <section className="admin-section">
            <form className="admin-form" onSubmit={(e) => { void submitOrder(e); }}>
              <h2>{orderForm.id ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}</h2>
              <select value={orderForm.customer_id} onChange={(e) => setOrderForm((prev) => ({ ...prev, customer_id: e.target.value }))} required>
                <option value="">Chọn khách hàng</option>
                {customerOptions.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
              </select>
              <select value={orderForm.product_id} onChange={(e) => setOrderForm((prev) => ({ ...prev, product_id: e.target.value, amount: '' }))} required>
                <option value="">Chọn sản phẩm</option>
                {productOptions.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.stock_quantity} còn)</option>)}
              </select>
              <input value={orderForm.quantity} onChange={(e) => setOrderForm((prev) => ({ ...prev, quantity: e.target.value, amount: '' }))} type="number" min="1" placeholder="Số lượng" required />
              <input value={orderForm.amount} onChange={(e) => setOrderForm((prev) => ({ ...prev, amount: e.target.value }))} type="number" min="0" placeholder="Tổng tiền" required />
              <input value={orderForm.email} onChange={(e) => setOrderForm((prev) => ({ ...prev, email: e.target.value }))} type="email" placeholder="Email khách hàng" />
              <input value={orderForm.phone} onChange={(e) => setOrderForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Số điện thoại" />
              <textarea value={orderForm.address} onChange={(e) => setOrderForm((prev) => ({ ...prev, address: e.target.value }))} rows="3" placeholder="Địa chỉ" />
              <input value={orderForm.transfer_content} onChange={(e) => setOrderForm((prev) => ({ ...prev, transfer_content: e.target.value }))} placeholder="Nội dung chuyển khoản" />
              <select value={orderForm.status} onChange={(e) => setOrderForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="paid">Đã thanh toán</option>
                <option value="pending_payment">Chờ thanh toán</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <input value={orderForm.purchased_at} onChange={(e) => setOrderForm((prev) => ({ ...prev, purchased_at: e.target.value }))} type="date" required />
              <textarea value={orderForm.note} onChange={(e) => setOrderForm((prev) => ({ ...prev, note: e.target.value }))} rows="3" placeholder="Ghi chú" />
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>{orderForm.id ? 'Lưu đơn hàng' : 'Thêm mới'}</button>
                {orderForm.id && <button type="button" className="btn btn-outline" onClick={() => setOrderForm(orderDefaults)}>Hủy chỉnh sửa</button>}
              </div>
            </form>

            <div className="admin-list-card">
              <h2>Danh sách đơn hàng</h2>
              <p style={{ marginBottom: '12px', color: 'var(--text-muted)' }}>
                Nếu khách đã chuyển khoản nhưng nội dung CK thực tế không khớp hoàn toàn để hệ thống auto nhận diện,
                bạn có thể đổi trạng thái đơn hàng sang <strong>Đã thanh toán</strong> bằng tay ngay tại đây.
              </p>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Khách hàng</th><th>Email</th><th>Sản phẩm</th><th>SL</th><th>Số tiền</th><th>Nội dung CK</th><th>Trạng thái</th><th></th></tr>
                  </thead>
                  <tbody>
                    {db.orders.length === 0 && <tr><td colSpan="8">Chưa có đơn hàng nào.</td></tr>}
                    {db.orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.customer_name || '-'}</td>
                        <td>{order.email || customerOptions.find((customer) => customer.id === order.customer_id)?.email || '-'}</td>
                        <td>{order.product_name || '-'}</td>
                        <td>{order.quantity || 1}</td>
                        <td>{formatPrice(order.amount)}</td>
                        <td>{order.transfer_content || '-'}</td>
                        <td>{order.status}</td>
                        <td className="table-actions">
                          {order.status !== 'paid' && (
                            <button type="button" onClick={() => { void markOrderPaid(order); }}>
                              Đánh dấu đã thanh toán
                            </button>
                          )}
                          <button type="button" onClick={() => setOrderForm({ ...order, quantity: String(order.quantity || 1), amount: String(order.amount || 0) })}>Sửa</button>
                          <button type="button" onClick={() => { void removeRecord('orders', order.id); }}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
