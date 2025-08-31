from app.main import create_app

app = create_app()

if __name__ == "__main__":
    # This block is for local development.
    # In production, a WSGI server like Gunicorn will run the 'app' object directly.
    app.run(debug=True, host='0.0.0.0', port=5000)
