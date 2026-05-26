async function loadStatus() {
	const statusPill = document.getElementById("status-pill");

	try {
		const response = await fetch("/api/status");
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const data = await response.json();
		const system = data.system;
		const pihole = data.pihole;

		document.getElementById("hostname").textContent = system.hostname;
		document.getElementById("cpu").textContent = `${system.cpu_percent}%`;
		document.getElementById("memory").textContent = `${system.memory.percent}%`;
		document.getElementById("disk").textContent = `${system.disk.percent}%`;
		document.getElementById("uptime").textContent = formatUptime(system.uptime_seconds);

		document.getElementById("ftl").textContent = pihole.ftl_active ? "Active" : "Down";
		document.getElementById("blocking").textContent = pihole.blocking_enabled ? "Enabled" : "Disabled";
		document.getElementById("gravity").textContent = Number(pihole.gravity_domains).toLocaleString();
		document.getElementById("queries").textContent = Number(pihole.dns_queries_today).toLocaleString();
		document.getElementById("blocked").textContent = Number(pihole.blocked_queries_today).toLocaleString();
		document.getElementById("mode").textContent = pihole.mode;

		statusPill.textContent = "Online";
		statusPill.className = "status-pill ok";
	} catch (error) {
		statusPill.textContent = "Offline";
		statusPill.className = "status-pill error";
		console.error("Status load failed:", error);
	}
}

function formatUptime(seconds) {
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	return `${days}d ${hours}h ${minutes}m`;
}

loadStatus();
setInterval(loadStatus, 10000);