# install globals tools
#sudo apt update && sudo apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common
sudo apt update && sudo apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common

# add docker's repository
#curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
#sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
#sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian stable"

# install docker && docker-compose
sudo apt update && sudo apt upgrade -y && sudo apt install docker.io #docker-ce docker-ce-cli containerd.io
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/bin/docker-compose && sudo chmod +x /usr/bin/docker-compose
# add docker's right for user
sudo usermod -aG docker $USER

# print docker & docker-compose version for confirm success installation
docker --version
docker-compose --version
