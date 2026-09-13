/**
 * The gold section divider from the reference build, drawn in CSS rather than
 * shipped as a raster image. Purely decorative, so it is hidden from
 * assistive tech.
 */
export default function GoldRule() {
  return (
    <div className="flex justify-center bg-canvas py-9" aria-hidden="true">
      <span className="gold-rule">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.5 21 11l-9 10.5L3 11l9-8.5Z"
            stroke="var(--color-gold)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d="M3 11h18M12 2.5v19" stroke="var(--color-gold-soft)" strokeWidth="0.75" />
        </svg>
      </span>
    </div>
  );
}
