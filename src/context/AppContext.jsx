import React, { createContext, useState, useEffect, useContext } from 'react';
import { CONFIG } from '../config/landingConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const initialTime = CONFIG.countdownMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    // Check if we have saved timestamp for timer
    const savedTime = localStorage.getItem('wolffia_time_left');
    const savedTimestamp = localStorage.getItem('wolffia_timestamp');
    
    if (savedTime && savedTimestamp) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
      const remaining = Math.max(0, parseInt(savedTime) - elapsed);
      if (remaining > 0) {
        setTimeLeft(remaining);
      }
    }

    // Timer countdown
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev > 0 ? prev - 1 : 0;
        localStorage.setItem('wolffia_time_left', newTime.toString());
        localStorage.setItem('wolffia_timestamp', Date.now().toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Tính toán các chỉ số ảo dựa trên thời gian đã trôi qua (elapsed)
  // Đảm bảo khi reload trang, thời gian và các con số này đồng bộ 100%
  const elapsedSeconds = initialTime - timeLeft;
  
  // Mỗi 10 giây tăng 1 người quan tâm
  const interested = CONFIG.socialProof.totalInterested + Math.floor(elapsedSeconds / 10);
  
  // Mỗi 15 giây tăng 1 người vào Zalo
  const inZalo = CONFIG.socialProof.totalInZalo + Math.floor(elapsedSeconds / 15);
  
  // Mỗi 45 giây giảm 1 suất, giữ lại tối thiểu 3 suất để tạo khan hiếm mà không hết hẳn
  const slots = Math.max(3, CONFIG.slotsRemaining - Math.floor(elapsedSeconds / 45));

  return (
    <AppContext.Provider value={{ timeLeft, interested, inZalo, slots }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
