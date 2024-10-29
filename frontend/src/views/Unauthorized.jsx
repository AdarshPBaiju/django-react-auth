
const Unauthorized = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card text-center shadow-lg" style={{ maxWidth: '400px' }}>
                <div className="card-body">
                    <h1 className="card-title text-danger">Unauthorized</h1>
                    <p className="card-text text-muted">
                        You do not have permission to access this page.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
