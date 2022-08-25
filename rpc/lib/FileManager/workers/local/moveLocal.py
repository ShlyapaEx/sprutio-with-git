import os
import shutil
import stat
import threading
import time
import traceback

from lib.FileManager.FM import REQUEST_DELAY
from lib.FileManager.workers.baseWorkerCustomer import BaseWorkerCustomer
from lib.FileManager.workers.progress_helper import update_progress


class MoveLocal(BaseWorkerCustomer):
    def __init__(self, source, target, paths, overwrite, *args, **kwargs):
        super(MoveLocal, self).__init__(*args, **kwargs)

        self.source = source
        self.target = target
        self.paths = paths
        self.overwrite = overwrite

    def run(self):
        try:
            self.preload()
            success_paths = []
            error_paths = []

            operation_progress = {
                "total_done": False,
                "total": 0,
                "operation_done": False,
                "processed": 0
            }

            source_path = self.source.get('path')
            target_path = self.target.get('path')

            if source_path is None:
                raise Exception("Source path empty")

            if target_path is None:
                raise Exception("Target path empty")

            source_path = self.get_abs_path(source_path)
            target_path = self.get_abs_path(target_path)

            self.logger.info("MoveLocal process run source = %s , target = %s" % (source_path, target_path))

            t_total = threading.Thread(target=self.get_total, args=(operation_progress, self.paths))
            t_total.start()

            # sleep for a while for better total counting
            time.sleep(REQUEST_DELAY)

            t_progress = threading.Thread(target=update_progress, args=(self, operation_progress,))
            t_progress.start()

            for path in self.paths:
                try:
                    abs_path = self.get_abs_path(path)
                    file_basename = os.path.basename(abs_path)

                    if os.path.isdir(abs_path):
                        destination = os.path.join(target_path, file_basename)

                        if not os.path.exists(destination):
                            st = os.stat(abs_path)
                            os.makedirs(destination, stat.S_IMODE(st.st_mode))
                        elif self.overwrite and os.path.exists(destination) and os.path.isdir(destination):
                            shutil.copymode(abs_path, destination)
                        elif self.overwrite and os.path.exists(destination) and not os.path.isdir(destination):
                            shutil.rmtree(destination)
                            st = os.stat(abs_path)
                            os.makedirs(destination, stat.S_IMODE(st.st_mode))
                        elif not self.overwrite and os.path.exists(destination) and not os.path.isdir(destination):
                            raise Exception("destination is not a dir")
                        else:
                            pass

                        for current, dirs, files in os.walk(abs_path, topdown=False):
                            relative_root = os.path.relpath(current, source_path)
                            target_current_dir = os.path.join(target_path, relative_root)

                            if not os.path.exists(target_current_dir):
                                st = os.stat(current)
                                os.makedirs(target_current_dir, stat.S_IMODE(st.st_mode))
                            elif self.overwrite and os.path.exists(target_current_dir) and os.path.isdir(
                                    target_current_dir):
                                shutil.copymode(current, target_current_dir)
                            elif self.overwrite and os.path.exists(target_current_dir) and not os.path.isdir(
                                    target_current_dir):
                                shutil.rmtree(target_current_dir)
                                st = os.stat(current)
                                os.makedirs(target_current_dir, stat.S_IMODE(st.st_mode))
                            elif not self.overwrite and os.path.exists(target_current_dir) and not os.path.isdir(
                                    target_current_dir):
                                raise Exception("destination is not a dir")
                            else:
                                pass

                            for f in files:
                                source_file = os.path.join(current, f)
                                target_file = os.path.join(target_path, relative_root, f)
                                if not os.path.exists(target_file):
                                    shutil.move(source_file, target_file)
                                elif self.overwrite and os.path.exists(target_file) and not os.path.isdir(target_file):
                                    shutil.move(source_file, target_file)
                                elif self.overwrite and os.path.isdir(target_file):
                                    """
                                    See https://docs.python.org/3.4/library/shutil.html?highlight=shutil#shutil.copy
                                    In case copy file when destination is dir
                                    """
                                    shutil.rmtree(target_file)
                                    shutil.move(source_file, target_file)
                                else:
                                    pass

                                operation_progress["processed"] += 1

                            operation_progress["processed"] += 1
                            shutil.rmtree(current)

                    elif os.path.isfile(abs_path):
                        try:
                            target_file = os.path.join(target_path, file_basename)
                            if not os.path.exists(target_file):
                                shutil.move(abs_path, target_file)
                            elif self.overwrite and os.path.exists(target_file) and not os.path.isdir(target_file):
                                shutil.move(abs_path, target_file)
                            elif self.overwrite and os.path.isdir(target_file):
                                """
                                See https://docs.python.org/3.4/library/shutil.html?highlight=shutil#shutil.copy
                                In case copy file when destination is dir
                                """
                                shutil.rmtree(target_file)
                                shutil.move(abs_path, target_file)
                            else:
                                pass
                            operation_progress["processed"] += 1
                        except Exception as e:
                            self.logger.info("Cannot move file %s , %s" % (abs_path, str(e)))
                            raise e
                        finally:
                            operation_progress["processed"] += 1

                    success_paths.append(path)

                except Exception as e:
                    self.logger.error(
                        "Error move %s , error %s , %s" % (str(path), str(e), traceback.format_exc()))
                    error_paths.append(path)

            operation_progress["operation_done"] = True

            result = {
                "success": success_paths,
                "errors": error_paths
            }

            # иначе пользователям кажется что скопировалось не полностью )
            progress = {
                'percent': round(float(len(success_paths)) / float(len(self.paths)), 2),
                'text': str(int(round(float(len(success_paths)) / float(len(self.paths)), 2) * 100)) + '%'
            }
            time.sleep(REQUEST_DELAY)
            self.on_success(self.status_id, data=result, progress=progress, pid=self.pid, pname=self.name)

        except Exception as e:
            result = {
                "error": True,
                "message": str(e),
                "traceback": traceback.format_exc()
            }

            self.on_error(self.status_id, result, pid=self.pid, pname=self.name)

    def get_total(self, progress_object, paths, count_dirs=True, count_files=True):

        self.logger.debug("start get_total() dirs = %s , files = %s" % (count_dirs, count_files))
        for path in paths:
            try:
                abs_path = self.get_abs_path(path)

                if count_dirs:
                    progress_object["total"] += 1

                for current, dirs, files in os.walk(abs_path):
                    if count_dirs:
                        progress_object["total"] += len(dirs)
                    if count_files:
                        progress_object["total"] += len(files)
            except Exception as e:
                self.logger.error("Error get_total file %s , error %s" % (str(path), str(e)))
                continue

        progress_object["total_done"] = True
        self.logger.debug("done get_total()")
        return
