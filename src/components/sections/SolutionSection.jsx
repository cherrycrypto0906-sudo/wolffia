import React from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaCheckCircle } from 'react-icons/fa';
import './SolutionSection.css';

export const SolutionSection = () => {
  const benefits = [
    "Dễ dùng mỗi ngày",
    "Ít áp lực hơn",
    "Hợp món quen",
    "Nhìn là muốn ăn"
  ];

  return (
    <section className="solution-section section-padding">
      <div className="container solution-container">
        <div className="solution-visual">
          <RevealOnScroll className="solution-image-container">
            <img 
              src={CONFIG.images.productBox} 
              alt="Hộp Wolffia tươi Diệp Châu" 
              className="solution-image" 
            />
            <div className="solution-badge">
              Gọn gàng, sạch sẽ, chuẩn tươi
            </div>
          </RevealOnScroll>
        </div>
        
        <div className="solution-content">
          <RevealOnScroll>
            <h2>Diệp Châu chọn Wolffia như một cách ăn xanh nhẹ nhàng hơn cho ngày bận rộn</h2>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <h3 className="solution-subheadline">
              Dễ thêm vào món quen. Nhanh gọn. Nhìn đẹp. Không tạo cảm giác phải cố quá nhiều.
            </h3>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <p className="solution-body">
              Wolffia là kiểu nguyên liệu bạn có thể thêm nhanh vào salad, cháo, súp, mì hay bowl ăn sáng.
              Chỉ một chút thôi cũng đủ làm bữa ăn trông tươi hơn, có gu hơn và khiến việc ăn uống tử tế trở nên dễ bắt đầu lại hơn.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <ul className="solution-benefits">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefit-chip">
                  <span className="benefit-icon"><FaCheckCircle /></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </div>
      
      <div className="container mt-5">
        <RevealOnScroll delay={400} className="text-center">
          <h3 className="mb-4" style={{ color: 'var(--primary-dark)' }}>Hồ sơ dinh dưỡng vượt trội</h3>
          <div className="nutrition-chart-container">
            <img src={CONFIG.images.nutritionChart} alt="Dinh dưỡng Wolffia" className="nutrition-chart-img" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
