/**
 * Room2Placeholder.jsx — Room 2 Coming Soon Placeholder
 * Requirements: 6.10
 *
 * UI-only placeholder — no PLC integration.
 * Styled to match the existing dark-theme PLC screen design.
 */
import React from 'react';

export default function Room2Placeholder() {
    return (
        <div className="plc-page">

            {/* ── Page Header ───────────────────────────────────────────────── */}
            <div className="plc-page-header">
                <div>
                    <h2 className="plc-page-title">Room 2 — Coming Soon</h2>
                    <p className="plc-page-sub">
                        Room 2 conveyor integration is planned for a future release
                    </p>
                </div>

                {/* Status pill */}
                <span className="plc-badge plc-badge-grey" title="Not yet implemented">
                    <span className="plc-badge-dot plc-badge-dot-grey" />
                    Planned
                </span>
            </div>

            {/* ── Placeholder Card ──────────────────────────────────────────── */}
            <div className="plc-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>

                {/* Construction icon */}
                <div style={{ fontSize: '4rem', lineHeight: 1, marginBottom: '1.25rem' }}>
                    🚧
                </div>

                <h3
                    style={{
                        fontSize: '1.375rem',
                        fontWeight: 600,
                        marginBottom: '0.75rem',
                    }}
                    className="plc-page-title"
                >
                    Room 2 Conveyor — Not Yet Available
                </h3>

                <p
                    style={{
                        maxWidth: '480px',
                        margin: '0 auto 2rem',
                        lineHeight: 1.65,
                    }}
                    className="plc-page-sub"
                >
                    The Room 2 conveyor integration with the Delta DVP PLC is planned for
                    a future release. This screen will provide the same rack-selection
                    controls, live sensor indicators, and real-time belt visualisation as
                    the Room 1 interface once implementation is complete.
                </p>

                {/* Feature preview list */}
                <ul
                    style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 auto',
                        maxWidth: '360px',
                        textAlign: 'left',
                        display: 'inline-block',
                    }}
                    className="plc-page-sub"
                >
                    {[
                        'Rack selection & momentary-pulse commands',
                        'Live sensor indicator panel',
                        'Real-time belt animation via Modbus registers',
                        'Emergency Stop and conveyor control buttons',
                        'Routing engine integration',
                    ].map((feature) => (
                        <li
                            key={feature}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.35rem 0',
                            }}
                        >
                            {/* Placeholder dot */}
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#475569',   /* slate-600 */
                                    flexShrink: 0,
                                }}
                            />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
