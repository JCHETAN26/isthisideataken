export default function HomePage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0f',
            color: 'white',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    IsThisIdeaTaken Backend API
                </h1>
                <p style={{ color: '#a0a0b0', marginBottom: '2rem' }}>
                    The backend API is running successfully.
                </p>
                <div style={{
                    background: '#1a1a24',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    textAlign: 'left'
                }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                        API Endpoint
                    </h2>
                    <code style={{
                        display: 'block',
                        background: '#0a0a0f',
                        padding: '0.75rem',
                        borderRadius: '0.25rem',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        POST /api/check-idea
                    </code>
                    <p style={{ color: '#a0a0b0', fontSize: '0.875rem' }}>
                        Send a POST request with your startup idea to validate it.
                    </p>
                </div>
            </div>
        </div>
    );
}
