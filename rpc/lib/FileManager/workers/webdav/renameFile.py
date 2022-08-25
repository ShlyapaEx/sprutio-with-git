import os
import traceback

from lib.FileManager.WebDavConnection import WebDavConnection
from lib.FileManager.workers.baseWorkerCustomer import BaseWorkerCustomer


class RenameFile(BaseWorkerCustomer):

    def __init__(self, source_path, target_path, session, *args, **kwargs):
        super(RenameFile, self).__init__(*args, **kwargs)

        self.source_path = source_path
        self.target_path = target_path
        self.session = session

    def run(self):
        try:
            self.preload()

            source_abs_path = os.path.abspath(self.source_path)
            target_abs_path = os.path.abspath(self.target_path)

            self.logger.debug("FM WebDav NewFile worker run(), source_abs_path = %s, target_abs_path = %s" %
                              (source_abs_path, target_abs_path))

            webdav_connection = WebDavConnection.create(self.login, self.session.get('server_id'), self.logger)

            try:
                if webdav_connection.isdir(source_abs_path):
                    source_abs_path += '/'
                    target_abs_path += '/'
                source_info = webdav_connection.generate_file_info(source_abs_path)
                webdav_connection.move_file(source_abs_path, target_abs_path)
                target_info = webdav_connection.generate_file_info(target_abs_path)

                webdav_result = {
                    "source": source_info,
                    "target": target_info
                }

                result = {
                    "data": webdav_result,
                    "error": False,
                    "message": None,
                    "traceback": None
                }

                self.on_success(result)

            except Exception as e:
                result = WebDavConnection.get_error(e, "Unable to rename source element.")
                self.on_error(result)

        except Exception as e:
            result = {
                "error": True,
                "message": str(e),
                "traceback": traceback.format_exc()
            }

            self.on_error(result)

