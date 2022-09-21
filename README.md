### README

La branche main va contenir la version actuelle et mise a jour du projet.
Chaque modification fera l'objet d'un ticket sur la page "Project" dans le repo.

# Créer une nouvelle branche
`git branch <new_branch>`

# Set la branche sur le repo distant
`git push --set-upstream origin <new_branch>`

# Push notre travail
`git push -u origin <branch_name>`

# Une fois qu'on veut fusionner notre branche avec le main
> Aller sur Github.com, dans le projet, se rendre sur sa branche
> Cliquer sur Contribute, Open Pull Request
> A droite, choisir le reviewer
> Remplir le formulaire, puis Create Pull Request
(Reviewer: commit, merge, puis delete branch depuis l'interface)

## Usefull memo

# Supprimer la branche du repo distant
`git push origin --delete <branch_name>`

# Supprimer une branche en local
`git branch -D <branch_name>`

# Lister les branches en local
`git branch`

# Lister les branches sur le depot distant
`git branch -a`