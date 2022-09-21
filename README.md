# For a good use of git - English

## Instructions

Working branches :
- The branch `main` is always tested and should be working, when branch `dev` is working we push the work on `main`
- The branch `dev` is the recent modifications of the differents branches linked to it.
- The branches with modifications are explained below.

Differents ways to make modifications:
- Create directly a pull request.
- Write an issue if you can't handle this problem.
- Write a task into project.

Accroding on a way of naming modifications branches :
`#<number>#-<functionnality>`
Examples :
- `#1#-Front-NavBar` : Issue number 1 about the NavBar
- `#5#-Front-NavBar` : 5th modification about NavBar
- `#1#-Docker-Compose` : 1st modification on Docker-Compose
- `#7#-Back-User` : Ticket number 7 on the User Module
- Warning: Each number should track the number of the modification we are taking on the project, Issue, Project and Pull Request.

## Commands

### Creating a new branch
`git branch <new_branch>`

### Going on the new branch (local mode)
`git checkout <new_branch>`

### Set branch on the distant repo
`git push --set-upstream origin <new_branch>` ou `git push -u origin <new_branch>`

### When we want to merge our branch with the `dev` branch
- Go on Github.com, into the project, choose our current branch
- Click on `Contribute`, then `Open Pull Request`
- To the right, choosing the reviewer
- Fill the form, then `Create Pull Request`
- (If no conflicts, click `Merge Pull Request`)
- (Reviewer: `commit`, `merge`, then `delete branch` from github's interface)

## Usefull memo

### Delete the branch from the distant repo
`git push origin --delete <branch_name>`

### Delete a branch in local mode
`git branch -D <branch_name>`

### List all the branches in local mode
`git branch`

### List all the branches of the distant repo
`git branch -a`

# Pour un bon usage de git - Français

## Instructions

La branche main va contenir la version actuelle et mise a jour du projet.
Chaque modification fera l'objet d'un ticket sur la page "Project" dans le repo.

Les branches fonctionnelles :
- La branche `main` est toujours testée et doit etre continuellement en train de fonctionner, lorsque la branche `dev` fonctionne, pousser les changement sur `main`.
- La branche `dev` reçoit les modifications recentes des branches liée mais ne fonctionne pas forcement.
- Les branches qui apportent des modifications sont expliquées ci-dessous.

Differentes manières de faire des modifications:
- Créer directement une requête pull.
- Ecrire une issue dans l'interface de github.
- Ecrire une tache dans le projet de github.

Accordons nous sur une maniere de nommer les branches de modification :
`#<numero>#-<fonctionnalité>`
Exemples :
- `#1#-Front-NavBar` : L'issue numero un de NavBar
- `#5#-Front-NavBar` : 5e modification de NavBar
- `#1#-Docker-Compose` : 1ere modification de Docker-Compose
- `#7#-Back-User` : Ticket numero 7 du module User.
- Attention: Chacque numero doit se suivre et doit representer le numero de modification, issue, projet et request comprises.

## Commandes

### Créer une nouvelle branche
`git branch <new_branch>`

### Se rendre sur la nouvelle branche
`git checkout <new_branch>`

### Set la branche sur le repo distant
`git push --set-upstream origin <new_branch>` ou `git push -u origin <new_branch>`

### Une fois qu'on veut fusionner notre branche avec le main
- Aller sur Github.com, dans le projet, se rendre sur sa branche
- Cliquer sur Contribute, Open Pull Request
- A droite, choisir le reviewer
- Remplir le formulaire, puis Create Pull Request
- (Si pas de conflits, faire merge pull request)
- (Reviewer: commit, merge, puis delete branch depuis l'interface)

## Memo utile

### Supprimer la branche du repo distant
`git push origin --delete <branch_name>`

### Supprimer une branche en local
`git branch -D <branch_name>`

### Lister les branches en local
`git branch`

### Lister les branches sur le depot distant
`git branch -a`