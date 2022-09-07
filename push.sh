#!/bin/bash
echo "Nom du commit :"
read commit_name
make down
volumeExist=`ls -l | grep "volume" | wc -l`

if [volumeExist !== 0]
then
  cd frontend/volume
  test=`ls -l | wc -l`
  if [test !== 0]
  then
    sudo rm -rf node_modules && sudo cp -rf ./* ../sources && sudo rm -rf *
  fi
  cd $OLDPWD
fi


git add .
git commit -m "$commit_name"
git push
