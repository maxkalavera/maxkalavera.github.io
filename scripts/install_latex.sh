# To run locally use
# docker run --platform linux/x86_64 --volume $(pwd):/root/src/ -w /root/ -it ubuntu /bin/bash

TINYTEX_URL=https://github.com/rstudio/tinytex-releases/releases/download/v2026.08/TinyTeX-1-linux-x86_64-v2026.08.tar.xz

# Update remotes
sudo apt update -y
# Install Ubuntu dependencies
sudo apt install -y \
  wget \
  perl \
  libfreetype6 libfreetype6-dev libfontconfig1 libfontconfig1-dev build-essential chrpath libssl-dev libxft-dev
# make sure perl is properly installed (e.g., apt install -y perl)
perl -mFile::Find /dev/null

# then install TinyTeX
wget --retry-connrefused --progress=dot:giga -O TinyTeX.tar.gz ${TINYTEX_URL}
tar xf TinyTeX.tar.gz -C "$HOME"
rm TinyTeX.tar.gz

sudo ln -s $HOME/.TinyTeX/bin/*/* /usr/local/bin/ 

if [ ! -z "$GITHUB_WORKSPACE" ]; then
  xargs tlmgr install < "$GITHUB_WORKSPACE"/content/resume/latex/modules.txt
  xargs tlmgr update < "$GITHUB_WORKSPACE"/content/resume/latex/modules.txt
else
  xargs tlmgr install < ./src/content/resume/latex/modules.txt
  xargs tlmgr update < ./src/content/resume/latex/modules.txt
fi
