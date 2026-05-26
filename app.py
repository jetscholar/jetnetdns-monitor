from flask import Flask, render_template
from dotenv import load_dotenv
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
	app.run(
		host="127.0.0.1",
		port=3007,
		debug=True,
		use_reloader=False
	)