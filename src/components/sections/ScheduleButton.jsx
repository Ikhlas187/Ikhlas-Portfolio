import './ScheduleButton.css';

/**
 * Reproduction fidèle du bouton "Schedule your call" de verteal.com :
 * pill gris clair + puce noire carrée avec flèche rouge-orange.
 * Au survol, le libellé glisse (swap des deux copies) et la flèche se décale.
 */
export default function ScheduleButton({
  href = 'https://cal.com/verteal/15min',
  label = 'Schedule your call',
}) {
  return (
    <a className="vt-btn" href={href} target="_blank" rel="noreferrer">
      <span className="vt-btn__pill">
        <span className="vt-btn__label">
          <span className="vt-btn__line">{label}</span>
          <span className="vt-btn__line" aria-hidden="true">{label}</span>
        </span>
      </span>
      <span className="vt-btn__icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 12L12 4M12 4H5.5M12 4V10.5"
            stroke="#FF4D2E"
            strokeWidth="1.6"
            strokeLinecap="square"
          />
        </svg>
      </span>
    </a>
  );
}
