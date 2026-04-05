import React from 'react';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaSeedling, FaShieldAlt, FaHeartbeat } from 'react-icons/fa';
import './NutritionInfo.css';

export const NutritionInfo = () => {
  const infoCards = [
    {
      icon: <FaSeedling size={24} />,
      text: "Nguồn đạm thực vật thú vị"
    },
    {
      icon: <FaShieldAlt size={24} />,
      text: "Có đủ các acid amin thiết yếu"
    },
    {
      icon: <FaHeartbeat size={24} />,
      text: "Có chất xơ và vi chất đáng chú ý"
    },
    {
      text: "Dễ thêm vào bữa ăn hằng ngày"
    },
    {
      text: "Hợp với người muốn ăn xanh đa dạng hơn"
    }
  ];

  return (
    <section className="nutrition-section section-padding">
      <div className="container">
        
        <div className="nutrition-header text-center">
          <RevealOnScroll>
            <h2>Wolffia là gì mà nhiều người ăn healthy bắt đầu quan tâm?</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="nutrition-subheadline">
              Không chỉ mới lạ và đẹp mắt, Wolffia còn là một nguyên liệu xanh có hồ sơ dinh dưỡng khá thú vị.
            </p>
          </RevealOnScroll>
        </div>

        <div className="nutrition-body">
          <RevealOnScroll delay={200} className="nutrition-text-block">
            <p>
              Wolffia là một loại thực vật nước siêu nhỏ, đã được dùng làm thực phẩm ở một số nơi tại châu Á.
              Nhiều nghiên cứu trên Wolffia ghi nhận đây là một nguyên liệu thực vật có hồ sơ dinh dưỡng đáng chú ý, với protein thực vật, các acid amin thiết yếu, chất xơ và một số vi chất như sắt, kẽm, cùng các hợp chất chống oxy hoá như polyphenol.
            </p>
            <div className="nutrition-disclaimer">
              Với Diệp Châu, Wolffia không phải là thứ để nói quá lên như một giải pháp thần kỳ.<br/>
              Đây đơn giản là một <strong>lựa chọn xanh mới, gọn, đẹp và đáng thử</strong> cho những ai muốn ăn tốt hơn theo cách dễ duy trì hơn.
            </div>
          </RevealOnScroll>
        </div>

        <div className="nutrition-grid">
          {infoCards.map((card, index) => (
            <RevealOnScroll key={index} delay={300 + index * 50} className={`nutrition-card ${card.icon ? 'has-icon' : ''}`}>
              {card.icon && <div className="card-icon">{card.icon}</div>}
              <span>{card.text}</span>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
