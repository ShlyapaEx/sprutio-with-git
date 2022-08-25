import os
import traceback

from lib.FileManager.workers.baseWorkerCustomer import BaseWorkerCustomer


class ListFiles(BaseWorkerCustomer):
    def __init__(self, path, session, *args, **kwargs):
        super(ListFiles, self).__init__(*args, **kwargs)

        self.path = path
        self.session = session

    def run(self):
        try:
            self.preload()
            abs_path = os.path.abspath(self.path)
            self.logger.debug("FM FTP ListFiles worker run(), abs_path = %s" % abs_path)

            ftp_connection = self.get_ftp_connection(self.session)
            listing = ftp_connection.list(path=abs_path)

            result = {
                "data": listing,
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
