import React from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import { FaClock, FaLeaf, FaDumbbell } from 'react-icons/fa';
import './PainSection.css';

export const PainSection = () => {
  const painCards = [
    {
      icon: <FaClock size={28} />,
      title: "Muốn ăn tốt hơn nhưng quá bận",
      text: "Không có đủ thời gian lên thực đơn, đi chợ, nấu nướng và dọn dẹp mỗi ngày."
    },
    {
      icon: <FaLeaf size={28} />,
      title: "Muốn healthy hơn nhưng ngại chuẩn bị",
      text: "Ngại các thao tác sơ chế rau củ, chần, luộc, xay ép cồng kềnh."
    },
    {
      icon: <FaDumbbell size={28} />,
      title: "Muốn duy trì nhưng dễ bỏ cuộc",
      text: "Ăn đồ luộc mãi cũng chán, ăn đa dạng thì mất công, cuối cùng lại quay về thói quen cũ."
    }
  ];

  return (
    <section className="pain-section section-padding">
      <div className="container">
        
        <div className="pain-header text-center">
          <RevealOnScroll>
            <h2>Biết nên ăn tốt hơn là một chuyện.<br/>Duy trì được mỗi ngày lại là chuyện khác.</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="pain-subheadline">
              Phần lớn mọi người không thiếu ý thức ăn uống. Chỉ là cuộc sống quá bận, nên bữa ăn thường bị làm cho nhanh, cho tiện, cho xong.
            </p>
          </RevealOnScroll>
        </div>

        <div className="pain-split">
          <RevealOnScroll className="pain-text-column">
            <p>
              Mẹ bỉm thì bận con, bận nhà.<br/>
              Người đi làm thì xoay giữa công việc và đủ thứ việc nhỏ.<br/>
              Người muốn ăn healthy hơn thì lại dễ bỏ cuộc vì quá mất thời gian chuẩn bị.
            </p>
            <p>
              Muốn ăn xanh hơn, nhưng ngại sơ chế.<br/>
              Muốn bữa healthy nhanh mà không nhàm.<br/>
              Muốn chăm mình hơn, nhưng không muốn thêm việc.
            </p>
            <div className="pain-highlight">
              Thứ nhiều người thật sự cần không phải là thêm áp lực.<br/>
              Mà là một cách ăn tốt hơn đủ dễ để làm được mỗi ngày.
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll className="pain-image-column" delay={200}>
            <img 
              src={CONFIG.images.lifestyle} 
              alt="Lối sống bận rộn" 
              style={{ width: '100%', height: '100%', borderRadius: 'var(--rounded-lg)', boxShadow: 'var(--shadow-md)', objectFit: 'cover', aspectRatio: '4/3' }} 
            />
          </RevealOnScroll>
        </div>

        <div className="pain-cards">
          {painCards.map((card, index) => (
            <RevealOnScroll key={index} delay={300 + index * 100} className="pain-card">
              <div className="pain-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
