from flask import Blueprint, jsonify
from services.system_service import get_system_status
from services.pihole_service import get_pihole_status

status_bp = Blueprint("status", __name__)


@status_bp.route("/health")
def health():
	return "OK", 200


@status_bp.route("/api/status")
def api_status():
	return jsonify({
		"system": get_system_status(),
		"pihole": get_pihole_status()
	})