import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './CreepyButton.css';

export const CreepyButton = () => {
  const eyesRef = useRef<HTMLSpanElement>(null);
  const [eyeCoords, setEyeCoords] = useState({ x: 0, y: 0 });

  const translateX = `${-50 + eyeCoords.x * 50}%`;
  const translateY = `${-50 + eyeCoords.y * 50}%`;
  const eyeStyle = { transform: `translate(${translateX}, ${translateY})` };

  const updateEyes = (e: React.MouseEvent | React.TouchEvent) => {
    const userEvent = 'touches' in e ? e.touches[0] : e;
    const eyesRect = eyesRef.current?.getBoundingClientRect();
    if (!eyesRect) return;

    const eyes = {
      x: eyesRect.left + eyesRect.width / 2,
      y: eyesRect.top + eyesRect.height / 2,
    };
    const cursor = {
      x: userEvent.clientX,
      y: userEvent.clientY,
    };

    const dx = cursor.x - eyes.x;
    const dy = cursor.y - eyes.y;
    const angle = Math.atan2(-dy, dx) + Math.PI / 2;
    const visionRangeX = 180;
    const visionRangeY = 75;
    const distance = Math.hypot(dx, dy);
    const x = Math.sin(angle) * distance / visionRangeX;
    const y = Math.cos(angle) * distance / visionRangeY;

    setEyeCoords({ x, y });
  };

  return (
    <Link
      to="/live-sports"
      className="creepy-btn"
      onMouseMove={updateEyes}
      onTouchMove={updateEyes}
    >
      <span className="creepy-btn__eyes" ref={eyesRef}>
        <span className="creepy-btn__eye">
          <span className="creepy-btn__pupil" style={eyeStyle} />
        </span>
        <span className="creepy-btn__eye">
          <span className="creepy-btn__pupil" style={eyeStyle} />
        </span>
      </span>
      <span className="creepy-btn__cover">live sports ..?</span>
    </Link>
  );
};
