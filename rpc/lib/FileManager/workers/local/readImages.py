import os
import shutil
import stat
import traceback

from config.main import TMP_DIR
from lib.FileManager.workers.baseWorkerCustomer import BaseWorkerCustomer


class ReadImages(BaseWorkerCustomer):
    def __init__(self, paths, *args, **kwargs):
        super(ReadImages, self).__init__(*args, **kwargs)

        self.paths = paths

    def run(self):
        try:
            self.preload()
            self.logger.info("Local ReadImages process run")

            hash_str = self.random_hash()
            download_dir = TMP_DIR + '/images/' + self.login + '/' + hash_str + '/'
            success_paths, error_paths = self.copy_files_to_tmp(download_dir)

            if len(success_paths) == 1:
                one_file = True
            else:
                one_file = False

            if len(error_paths) == 0:  # Значит все хорошо, можно дальше обрабатывать

                file_list = {
                    "succeed": list(os.path.basename(filename) for filename in success_paths),
                    "failed": list(os.path.basename(filename) for filename in error_paths)
                }

                answer = {
                    "success": True,
                    "file_list": file_list,
                    "hash": hash_str,
                    "one_file": one_file,
                    "sid": self.login
                }

                result = {
                    "data": answer
                }

                self.on_success(result)
            else:
                raise Exception("read error")

        except Exception as e:
            result = {
                "error": True,
                "message": str(e),
                "traceback": traceback.format_exc()
            }

            self.on_error(result)

    def copy_files_to_tmp(self, target_path):
        if not os.path.exists(target_path):
            os.makedirs(target_path)

        success_paths = []
        error_paths = []

        for path in self.paths:
            try:
                abs_path = self.get_abs_path(path)
                source_path = os.path.dirname(path)
                file_basename = os.path.basename(abs_path)

                if os.path.isdir(abs_path):
                    destination = os.path.join(target_path, file_basename)

                    if not os.path.exists(destination):
                        st = os.stat(abs_path)
                        os.makedirs(destination, stat.S_IMODE(st.st_mode))
                    else:
                        raise Exception("destination already exist")

                    for current, dirs, files in os.walk(abs_path):
                        relative_root = os.path.relpath(current, source_path)
                        for d in dirs:
                            source_dir = os.path.join(current, d)
                            target_dir = os.path.join(target_path, relative_root, d)
                            if not os.path.exists(target_dir):
                                st = os.stat(source_dir)
                                os.makedirs(target_dir, stat.S_IMODE(st.st_mode))
                            else:
                                raise Exception("destination dir already exists")
                        for f in files:
                            source_file = os.path.join(current, f)
                            target_file = os.path.join(target_path, relative_root, f)
                            if not os.path.exists(target_file):
                                shutil.copy(source_file, target_file)
                            else:
                                raise Exception("destination file already exists")
                elif os.path.isfile(abs_path):
                    try:
                        target_file = os.path.join(target_path, file_basename)
                        if not os.path.exists(target_file):
                            shutil.copy(abs_path, target_file)
                        else:
                            raise Exception("destination file already exists")
                    except Exception as e:
                        self.logger.info("Cannot copy file %s , %s" % (abs_path, str(e)))
                        raise e

                success_paths.append(path)

            except Exception as e:
                self.logger.error(
                        "Error copy %s , error %s , %s" % (str(path), str(e), traceback.format_exc()))
                error_paths.append(path)

        return success_paths, error_paths
