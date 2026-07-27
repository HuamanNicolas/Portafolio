import { useMemo } from 'react';
import './StarryBackground.css';

const generateStars = (count, sizeClass) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: `${sizeClass}-${i}`,
      className: `star ${sizeClass}`,
      style: {
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        animationDuration: `${6 + Math.random() * 14}s`, // Entre 6s y 20s (el doble de antes)
        animationDelay: `${Math.random() * 4000}s`, // Retraso aleatorio hasta 20s para esparcir el inicio
      }
    });
  }
  return stars;
};

const StarryBackground = () => {
  // Reducimos la cantidad a la mitad
  const starsSmall = useMemo(() => generateStars(17, 'star-small'), []);
  const starsMedium = useMemo(() => generateStars(6, 'star-medium'), []);
  const starsLarge = useMemo(() => generateStars(3, 'star-large'), []);

  const allStars = [...starsSmall, ...starsMedium, ...starsLarge];

  return (
    <div className="starry-background">
      {allStars.map(star => (
        <div key={star.id} className={star.className} style={star.style}></div>
      ))}
    </div>
  );
};

export default StarryBackground;
