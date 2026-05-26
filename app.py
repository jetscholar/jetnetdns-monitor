import os

from dotenv import load_dotenv
from flask import Flask, render_template

from routes.status_routes import status_bp


def create_app():
	load_dotenv()

	app = Flask(__name__)
	app.register_blueprint(status_bp)

	@app.route("/")
	def dashboard():
		return render_template("dashboard.html")

	return app


app = create_app()


if __name__ == "__main__":
	host = os.getenv("APP_HOST", "127.0.0.1")
	port = int(os.getenv("APP_PORT", "3007"))
	debug = os.getenv("APP_ENV", "development") == "development"

	app.run(
		host=host,
		port=port,
		debug=debug,
		use_reloader=False
	)