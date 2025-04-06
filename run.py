from app import create_app
from waitress import serve

app = create_app()

if __name__ == '__main__':
    serve(app, host="0.0.0.0", port=80)

# from app import create_app

# app = create_app()

# if __name__ == '__main__':
#     app.run(debug=True, host='127.0.0.1', port=5000)