#!/usr/bin/env python3

import os
import sys
import subprocess
import random
import shutil
import signal
import verify


class timeout:
    def __init__(self, seconds=1, error_message='Timeout'):
        self.seconds = seconds
        self.error_message = error_message
    def handle_timeout(self, signum, frame):
        raise TimeoutError(self.error_message)
    def __enter__(self):
        signal.signal(signal.SIGALRM, self.handle_timeout)
        signal.alarm(self.seconds)
    def __exit__(self, type, value, traceback):
        signal.alarm(0)


class Docker:
    def __init__(self, image_name: str, cwd="") -> None:
        if cwd == "":
            cwd = os.getcwd()
        cwd = os.path.abspath(cwd)
        self._cwd = cwd
        self._container_name = ''.join([random.choice('0123456789abcdef') for _ in range(32)])
        subprocess.run(["docker", "run", "-id", "--name=" +
                        self._container_name, "--net=none", "-v",
                        os.path.join(cwd, "docker", self._container_name, "data")+":/data", image_name],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        #print("docker container created:{}".format(self._container_name))

    def close(self) -> None:
        subprocess.run(["docker", "kill", self._container_name],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(["docker", "rm", self._container_name],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        shutil.rmtree(os.path.join(self._cwd, "docker", self._container_name))
        #print("docker container destoryed:{}".format(self._container_name))

    @property
    def mounted_path(self) -> str:
        return os.path.join(self._cwd, "docker", self._container_name, "data")

    @property
    def container_name(self) -> str:
        return self._container_name

    def run(self, args, user=None, stdin=None, stdout=None, stderr=None, timeout=2.0) -> subprocess.CompletedProcess:
        new_args = ["docker", "exec", "-i"]
        if user is not None:
            new_args += ["--user", str(user)]
        args = new_args + [self._container_name] + list(args)
        return subprocess.run(args, stdout=stdout, stdin=stdin, stderr=stderr, timeout=timeout)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    MAGIC = b"pass_6b8956e69246b7bedf4f40c72a789e80"
    try:
        with timeout(seconds=10):
            token = input("token: ")
            if verify.validate(token) is None:
                print("wrong token")
                exit()
            src_len = int(input("code length: "))
            print("code (%d):" % src_len, flush=True)
            code = sys.stdin.read(src_len)
    except (ValueError, TimeoutError) as e:
        print(e)
        exit()

    try:
        docker = Docker("mian:1.0")
        filename = os.path.join(docker.mounted_path, "test.c")
        with open(filename, "w") as f:
            f.write(code)

        ok = False
        try:
            proc = docker.run(["/chall/check.sh", "/data/test.c"],
                            user="player",
                            timeout=10,
                            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
            if proc.stdout.strip() == MAGIC:
                ok = True
        except subprocess.TimeoutExpired:
            pass
    except:
        pass

    docker.close()

    if ok:
        os.system("cat flag.txt")
    else:
        print("wrong")
