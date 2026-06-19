# Dev server that disables caching so edits always show on refresh.
import http.server, socketserver
PORT = 8000
class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()
print(f"Serving http://localhost:{PORT}  (no-cache)")
socketserver.TCPServer(("", PORT), NoCache).serve_forever()
