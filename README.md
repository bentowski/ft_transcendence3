# For a good use of git

## Instructions

La branche main va contenir la version actuelle et mise a jour du projet.
Chaque modification fera l'objet d'un ticket sur la page "Project" dans le repo.

Differents ways to make modifications:
- Create directly a pull request.
- Write an issue if you can't handle this problem.
- Write a task into project.

Accroding on a way of naming branches :
- #<number>#-<functionnality>
- examples :
- #1#-Front-NavBar : Issue number 1 about the NavBar
- #5#-Front-NavBar : 5th modification about NavBar
- #1#-Docker-Compose : 1st modification on Docker-Compose
- #7#-Back-User : Ticket number 7 on the User Module
- Warning: Each number should track the number of the modification we are taking on the project

## Commands

### Créer une nouvelle branche
`git branch <new_branch>`

### Se rendre sur la nouvelle branche
`git checkout <new_branch>`

### Set la branche sur le repo distant
`git push --set-upstream origin <new_branch>`

### Push notre travail
`git push -u origin <branch_name>`

### Une fois qu'on veut fusionner notre branche avec le main
- Aller sur Github.com, dans le projet, se rendre sur sa branche
- Cliquer sur Contribute, Open Pull Request
- A droite, choisir le reviewer
- Remplir le formulaire, puis Create Pull Request
- (Si pas de conflits, faire merge pull request)
- (Reviewer: commit, merge, puis delete branch depuis l'interface)

## Usefull memo

### Supprimer la branche du repo distant
`git push origin --delete <branch_name>`

### Supprimer une branche en local
`git branch -D <branch_name>`

### Lister les branches en local
`git branch`

### Lister les branches sur le depot distant
`git branch -a`