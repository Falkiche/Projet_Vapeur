const getUsers = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.5;
            if (success) {
                resolve([
                    { id: 1, nom: "Arthur" },
                    { id: 2, nom: "Perceval" },
                    { id: 3, nom: "Karadoc" },
                    { id: 4, nom: "Guenièvre" },
                    { id: 5, nom: "Lancelot" },
                    { id: 6, nom: "Merlin" },
                ]);
            } else {
                reject("Erreur lors de l'obtention des utilisateurs.");
            }
        }, 2000);
    });
};

getUsers()
    .then((users) => {
        console.log(users);
    })
    .catch((error) => {
        console.error(error);
    });