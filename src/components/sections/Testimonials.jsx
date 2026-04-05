import React from 'react';
import { CONFIG } from '../../config/landingConfig';
import { RevealOnScroll } from '../UI/RevealOnScroll';
import './Testimonials.css';

export const Testimonials = () => {
  // Group reviews into pairs (Customer + Shop Reply) to form single screenshots
  const pairedReviews = [];
  for (let i = 0; i < CONFIG.chatReviews.length; i += 2) {
    if (CONFIG.chatReviews[i] && CONFIG.chatReviews[i+1]) {
      pairedReviews.push([CONFIG.chatReviews[i], CONFIG.chatReviews[i+1]]);
    }
  }

  const rotations = ["-2deg", "1.5deg", "-1.5deg", "2.5deg"];

  return (
    <section className="testimonials-section section-padding">
      <div className="container">
        
        <div className="testimonials-header text-center">
          <RevealOnScroll>
            <h2>Mọi người nói gì về Wolffia?</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <p className="testimonials-subheadline">
              Tâm lý chung của rất nhiều khách hàng mới. Hãy xem những người đã trải nghiệm thực tế nói gì về "hạt xanh" này nhé.
            </p>
          </RevealOnScroll>
        </div>

        <div className="screenshots-gallery">
          {pairedReviews.map((pair, index) => (
            <RevealOnScroll key={index} delay={200 + index * 100}>
              <div 
                className="feedback-screenshot" 
                style={{ transform: `rotate(${rotations[index % rotations.length]})` }}
              >
                <div className="fb-screen-header">
                  <div className="fb-screen-user">
                    <img src={pair[0].avatar} alt={pair[0].name} />
                    <div className="fb-user-info">
                      <strong>{pair[0].name}</strong>
                      <span>Đang hoạt động</span>
                    </div>
                  </div>
                </div>
                <div className="fb-screen-body">
                  <div className="fb-time">{pair[0].time}</div>
                  
                  {/* Customer Message */}
                  <div className="fb-msg-row fb-customer">
                    <img src={pair[0].avatar} alt="avatar" className="fb-msg-avatar" />
                    <div className="fb-bubbles">
                      {pair[0].messages.map((msg, idx) => (
                        <div key={idx} className="fb-bubble">{msg}</div>
                      ))}
                    </div>
                  </div>

                  {/* Shop Reply */}
                  <div className="fb-msg-row fb-shop">
                    <div className="fb-bubbles">
                      {pair[1].messages.map((msg, idx) => (
                        <div key={idx} className="fb-bubble">{msg}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
