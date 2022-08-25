import sqlite3
import traceback

from config.main import DB_FILE
from lib.FileManager.workers.baseWorkerCustomer import BaseWorkerCustomer


class InitCallback(BaseWorkerCustomer):
    def __init__(self, *args, **kwargs):
        super(InitCallback, self).__init__(*args, **kwargs)

    def run(self):
        try:
            self.preload()
            result = {
                "data": {
                    "account": {
                        "login": self.login,
                        "server": "localhost"
                    },
                    "connections": self.get_connections(),
                    "webdav_connections": self.get_webdav_connections(),
                },
                "error": False,
                "message": None,
                "traceback": None
            }
            self.on_success(result)

        except Exception as e:
            result = {
                "error": True,
                "message": str(e),
                "traceback": traceback.format_exc()
            }

            self.on_error(result)

    def get_connections(self):
        db = sqlite3.connect(DB_FILE)
        db.execute("PRAGMA journal_mode=MEMORY")
        print("Database created and opened successfully file = %s" % DB_FILE)

        cursor = db.cursor()

        try:
            connections = []

            cursor.execute("SELECT * FROM ftp_servers WHERE fm_login = ?", (self.login,))
            results = cursor.fetchall()
            for result in results:
                connections.append({
                    'id': result[0],
                    'host': result[2],
                    'port': result[3],
                    'user': result[4],
                    'decryptedPassword': result[5],
                    'type': 'ftp'
                })

            cursor.execute("SELECT * FROM sftp_servers WHERE fm_login = ?", (self.login,))
            results = cursor.fetchall()
            for result in results:
                connections.append({
                    'id': result[0],
                    'host': result[2],
                    'port': result[3],
                    'user': result[4],
                    'decryptedPassword': result[5],
                    'type': 'sftp'
                })

            return connections
        except Exception as e:
            raise e
        finally:
            db.close()

    def get_webdav_connections(self):
        db = sqlite3.connect(DB_FILE)
        db.execute("PRAGMA journal_mode=MEMORY")
        print("Database created and opened successfully file = %s" % DB_FILE)

        cursor = db.cursor()

        try:
            cursor.execute("SELECT * FROM webdav_servers WHERE fm_login = ?", (self.login,))
            results = cursor.fetchall()

            webdav_connections = []
            for result in results:
                webdav_connections.append({
                    'id': result[0],
                    'host': result[2],
                    'user': result[3],
                    'decryptedPassword': result[4]
                })
            return webdav_connections
        except Exception as e:
            raise e
        finally:
            db.close()
