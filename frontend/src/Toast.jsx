import { useEffect } from 'react';

function Toast({ message, type, onClose }) {
  // Un "useEffect" permet de lancer une action au moment où le composant apparaît
  useEffect(() => {
    // On lance le compte à rebours de 4 secondes (4000ms) pour fermer le toast automatiquement
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    // Si le composant disparaît avant les 4 secondes, on nettoie le chrono pour éviter les bugs
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert ${type === 'success' ? 'alert-success text-white' : 'alert-error text-white'} shadow-lg font-semibold rounded-lg`}>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Toast;
